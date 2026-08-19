# Specification: Ballerina XLSX Module

_Owners_: @YasanPunch \
_Reviewers_: @niveathika \
_Created_: 2026/05/02 \
_Updated_: 2026/08/15 \
_Edition_: Swan Lake

## Introduction

This is the specification for the `xlsx` module of the [Ballerina language](https://ballerina.io/), which provides functionality for reading and writing Microsoft Excel files in the XLSX (Office Open XML) format with type-safe data binding to Ballerina records.

The `xlsx` module specification is written to describe the functionality available from version 1.0.0 onwards.

If you have any feedback or suggestions about the module, start a discussion via a [GitHub issue](https://github.com/ballerina-platform/ballerina-library/issues) or in the [Discord server](https://discord.gg/ballerinalang). Based on the outcome of the discussion, the specification and implementation can be updated. Community contributions are also encouraged. If you notice an implementation that deviates from the specification, please raise an issue.

## Contents

1. [Overview](#1-overview)
2. [Data Types](#2-data-types)
   - 2.1. [Row and CellValue](#21-row-and-cellvalue)
   - 2.2. [CellRange](#22-cellrange)
3. [Configurations](#3-configurations)
   - 3.1. [Sheet read options](#31-sheet-read-options)
   - 3.2. [Table read options](#32-table-read-options)
   - 3.3. [Write options](#33-write-options)
   - 3.4. [FormulaMode](#34-formulamode)
   - 3.5. [FailSafeOptions](#35-failsafeoptions)
4. [Annotations](#4-annotations)
   - 4.1. [@xlsx:Name](#41-xlsxname)
5. [Simple API](#5-simple-api)
   - 5.1. [parseSheet](#51-parsesheet)
   - 5.2. [writeSheet](#52-writesheet)
   - 5.3. [parseTable](#53-parsetable)
   - 5.4. [writeTable](#54-writetable)
6. [Workbook API](#6-workbook-api)
   - 6.1. [Construction](#61-construction)
   - 6.2. [Workbook class](#62-workbook-class)
7. [Sheet API](#7-sheet-api)
8. [Table API](#8-table-api)
9. [Error Types](#9-error-types)
10. [Samples](#10-samples)
    - 10.1. [Parse to records](#101-parse-to-records)
    - 10.2. [Write from records](#102-write-from-records)
    - 10.3. [Header mapping with @xlsx:Name](#103-header-mapping-with-xlsxname)
    - 10.4. [Multi-sheet Workbook operations](#104-multi-sheet-workbook-operations)
    - 10.5. [Excel Tables](#105-excel-tables)
    - 10.6. [Bytes in, bytes out](#106-bytes-in-bytes-out)
    - 10.7. [Fail-safe error handling](#107-fail-safe-error-handling)
    - 10.8. [Date and time binding](#108-date-and-time-binding)
    - 10.9. [Large integer IDs](#109-large-integer-ids)

---

## 1. Overview

The `xlsx` module reads and writes Microsoft Excel files in the XLSX (Office Open XML) format. It provides:

- **Type-safe data binding.** XLSX rows bind to Ballerina records, maps, or string arrays. Excel column headers map to record fields automatically (overridable via `@xlsx:Name`).
- **Date and time binding.** Date, time, and date-time cells bind to `time:Civil` / `time:Date` / `time:TimeOfDay` (target-type-driven), with an ISO `string` fallback. See §10.8.
- **Two API tiers.** A functional one-shot API (`parseSheet` / `writeSheet`) for simple file-based ETL, and an object-based Workbook API for multi-sheet operations, byte-array I/O, sheet/table management, and cell-level control.
- **Excel Tables (ListObjects).** Reachable two ways — tier 1 `parseTable` / `writeTable` for one-shot flows, and the `Table` class via the Workbook API for richer operations (totals row, rename, resize).
- **Fail-safe error handling.** Optional row-level error recovery with console and file logging.
- **Constraint validation.** Integrates with `ballerina/constraint` annotations on parsed records.
- **Atomic file writes.** File-based saves use a temp-file + rename pattern, so a failed write never destroys the original file.

The module uses Apache POI 5.3.0 for XLSX processing. All operations load the entire workbook into memory (DOM model); streaming is not supported.

### Limitations

This release deliberately defers several features. The following are **not** supported:

- **Formula authoring on write.** Strings starting with `=` are written verbatim as text, not as formula cells. There is no `Formula` wrapper type.
- **Formula re-evaluation.** `FormulaMode.CACHED` returns the last cached value as-is. There is no `EVALUATE`, `RECALCULATE`, or `PRESERVE` mode.
- **Streaming.** No row-streaming API for files larger than memory.
- **Round-trip preservation through `parseSheet`/`writeSheet`.** Tier 1 sheet functions are a data-only pipe *for the sheet being written*: formulas, formatting, charts, comments, and Excel Tables on the target sheet are not preserved by a `parseSheet → writeSheet` cycle. Other sheets in the file **are** preserved — `writeSheet` opens the existing workbook and only replaces (or appends to) the named sheet. (`parseTable → writeTable` likewise preserves the surrounding workbook; the table's data range is rewritten and resized to fit, with the totals row and any content below carried along by the resize.) For richer preservation of the target sheet itself, use the Workbook API and edit cells in place.
- **XLS (legacy 97-2003) format**, password-protected files, named ranges, cell styling, and range operations.

### Notes

- **Large integers lose precision silently on write.** Integer values are written as numeric cells; values with `|n| > 2^53` lose precision silently — the same behaviour as Apache POI, openpyxl, and Excel itself. Declare the field as `string` to preserve exact digits. See §10.9.

---

## 2. Data Types

### 2.1 Row and CellValue

```ballerina
public type Row map<CellValue> | string[];

public type CellValue string|int|float|decimal|boolean
                    | time:Date|time:Civil|time:TimeOfDay|();
```

`Row` is the atomic single-row type. A row can be:
- A **`map<CellValue>`** — keys are column headers; values are cell values (`()` for a blank cell, since the empty cell is a member of `CellValue`). A typed **record** also binds when every field type is a subtype of `CellValue`; name its fields to match the headers, or use `@xlsx:Name`. To capture columns beyond the declared fields, give the record a `CellValue` rest descriptor (`record {| ...; CellValue...; |}`).
- A **`string[]`** — raw cell text in column order.

The map's value type is `CellValue` (not `anydata`) so the row contract matches what a cell can hold: a target field of an unsupported type (`xml`, `byte[]`, a nested record) is rejected at compile time rather than failing at runtime.

`parseSheet` takes the row shape as its target `typedesc<Row> t = <>` and returns `t[]`. `Row[]` is the input type for `writeSheet` / `writeTable`. Contextual typing at the call site infers the row shape:

```ballerina
type Order record {| int id; decimal amount; |};
Order[] orders     = check xlsx:parseSheet("orders.xlsx");    // t = Order; returns Order[]
string[][] raw     = check xlsx:parseSheet("orders.xlsx");    // t = string[]; returns string[][]
map<CellValue>[] m = check xlsx:parseSheet("orders.xlsx");    // t = map<CellValue>; returns map<CellValue>[]
```

**Untyped / broad reads.** When the target does not pin a specific scalar type — a
`map<CellValue>` value, a `CellValue` rest field, `Sheet.getCell`, `Sheet.getColumn`,
and `Table.getTotalRow` — each cell binds to its natural `CellValue`: a whole number →
`int`, a fractional number → `decimal`, a boolean → `boolean`, a string → `string`, a
date / time / date-time cell → an ISO 8601 `string` (the fallback when no `time:*`
target drives the binding; the time component is preserved), and a blank cell → `()`.

### 2.2 CellRange

`CellRange` describes a rectangular cell region as four 0-based, inclusive indices: `firstRowIndex`, `lastRowIndex`, `firstColumnIndex`, and `lastColumnIndex`.

Used by `Sheet.getUsedCellRange()`, `Sheet.createTable(name, range, headers)`, `Table.getCellRange()`, `Table.getDataCellRange()`, and `Table.resize(...)` (which also accepts an A1 string).

---

## 3. Configurations

### 3.1 Sheet read options

Read options are modelled by **applicability**: each operation accepts only the fields it can
honour. Two fields are universal to every read — `formulaMode` and `caseInsensitiveHeaders` — and
live in the `CommonParseOptions` base. Sheet reads add absolute row-window positioning
(`headerRowIndex`, `dataStartRowIndex`) in `CommonSheetParseOptions`. The record/map binding
controls are shared via the named `DataProjection` type.

`ParseOptions` is the bulk-read type (`parseSheet`, `Sheet.getRows`); `RowParseOptions` is the
single-row type (`Sheet.getRow`); `ColumnParseOptions` is the single-column type
(`Sheet.getColumn`). A single-row read is **fail-fast** (no `failSafe` — skipping the only
requested row would leave nothing to return), and a column read yields scalar cell values rather
than records (so constraint validation, data projection, and fail-safe do not apply).

| Field | Default | Applies to | Meaning |
|---|---|---|---|
| `formulaMode` | `CACHED` | all reads | How to handle formula cells. See [3.4](#34-formulamode). |
| `caseInsensitiveHeaders` | `false` | all reads | When `true`, header `"Name"` matches record field `name` or `NAME`. |
| `headerRowIndex` | `0` | sheet reads | 0-based row index of the header row. Set to `()` for headerless sheets — columns are exposed as `col0`, `col1`, … **Ignored when reading into `string[][]`**: raw mode is lossless, so the header row is returned as data — use `dataStartRowIndex` to skip leading rows. |
| `dataStartRowIndex` | unset | sheet reads | 0-based row index where data starts. Defaults to `headerRowIndex + 1` (or `0` when headerless). The bulk window is `[dataStartRowIndex, dataStartRowIndex + rowCount)`; `getRow(i)` reads row `dataStartRowIndex + i`. |
| `rowCount` | `()` | bulk + column | Maximum number of data rows (cells, for a column) to read. `()` reads all. |
| `enableConstraintValidation` | `true` | record/map reads | When `true`, parsed records are validated against any `@constraint` annotations. |
| `allowDataProjection` | `{}` | record/map reads | Default `{}` enables lenient mode (extra columns ignored). Set to `false` for strict mode (all record fields must have matching columns). `nilAsOptionalField` treats nil cells as field absence; `absentAsNilableType` allows missing columns for nilable/optional fields. |
| `failSafe` | unset | bulk reads | When set, row-level errors (type conversion, constraint validation) are logged and skipped instead of failing the parse. See [3.5](#35-failsafeoptions). |

### 3.2 Table read options

A table is **self-describing**: its column definitions are the header and its area is the data
range. Table reads therefore omit the positional `headerRowIndex` / `dataStartRowIndex` fields —
they include `CommonParseOptions` directly, not `CommonSheetParseOptions`. `TableParseOptions` is
the bulk type (`parseTable`, `Table.getRows`) and `TableRowParseOptions` the single-row type
(`Table.getRow`); the remaining fields behave exactly as in [3.1](#31-sheet-read-options).
`rowCount` caps the data rows read, with the header and any totals row always excluded.

### 3.3 Write options

Write operations are configured by records modelled on what each operation honours; `sheetName` is a positional parameter on `writeSheet`, not an option.

**`WriteOptions`** (`Sheet.putRows`):

| Field | Default | Behaviour |
|---|---|---|
| `writeHeaders` | `true` | Write a header row derived from record field names / map keys. Ignored for `string[][]` data, which is written positionally. |
| `startRowIndex` | `()` | 0-based target row. `()` resolves to the mode's natural point: the row below the existing data for `APPEND`, row 0 for `REPLACE` / `FAIL_IF_EXISTS`. |
| `sheetWriteMode` | `APPEND` | Disposition toward existing content (see below) — rows are added non-destructively by default. |

**`SheetWriteOptions`** (`writeSheet`):

| Field | Default | Behaviour |
|---|---|---|
| `writeHeaders` | `true` | As above. |
| `startRowIndex` | `0` | 0-based row where a fresh write starts. Used by `FAIL_IF_EXISTS` and `REPLACE`; ignored by `APPEND`, which always writes below the existing data. |
| `sheetWriteMode` | `FAIL_IF_EXISTS` | Disposition toward the target sheet. The default fails rather than touch an existing sheet; `REPLACE` is destructive for the target sheet (drops and recreates it). |

**`RowWriteOptions`** (`Sheet.setRow`):

| Field | Default | Behaviour |
|---|---|---|
| `headerRowIndex` | `0` | 0-based row holding the headers that a record / map row aligns against by name. Ignored for `string[]` data, which is written positionally. |
| `sheetWriteMode` | `REPLACE` | The target row is overwritten by default. |

`SheetWriteMode` expresses one contract — the disposition toward content already at the target. It is shared by `writeSheet` (target = the named sheet) and `Sheet.putRows` / `Sheet.setRow` (target = the rows being written); only the per-operation defaults differ, as above.

- `FAIL_IF_EXISTS` — fail rather than touch existing content (the sheet already exists / the target rows are occupied).
- `REPLACE` — overwrite in place. `writeSheet` drops and recreates the sheet; the row writers overwrite the target rows.
- `APPEND` — add new content without overwriting. Any content in the way of an insert shifts down to make room; `writeSheet` takes no insert position, so its rows always land below the existing data. See the per-operation behaviour table in [5.2](#52-writesheet).

**`TableWriteOptions`** (`writeTable` / `Table.putRows`):

| Field | Default | Behaviour |
|---|---|---|
| `tableWriteMode` | `REPLACE` | `REPLACE` replaces the table's data and resizes the data range to fit exactly (it grows or shrinks). `APPEND` adds rows below the existing data. A table always has a data region, so there is no `FAIL_IF_EXISTS` mode. |
| `insertAt` | `()` | `APPEND` only: 0-based data-row index to insert at; `()` appends at the bottom. Ignored by `REPLACE`. |

A table is self-describing — its header and data range are authoritative — so `TableWriteOptions` carries no positional or header fields.

### 3.4 FormulaMode

`FormulaMode` selects how formula cells are read:

- `CACHED` (default): Returns the formula cell's last calculated/cached value. The Ballerina target type must match the cached value's type.
- `TEXT`: Returns the formula expression as a string (e.g., `"=SUM(A1:A10)"`). The target field must accept `string` — otherwise a `TypeConversionError` is raised.

**Formula authoring on write is not supported.** Strings starting with `=` are written as plain text.

### 3.5 FailSafeOptions

Fail-safe parsing is enabled by setting the `failSafe` field of a bulk-read options record to a `FailSafeOptions` value:

| Field | Default | Behaviour |
|---|---|---|
| `enableConsoleLogs` | `true` | Log each skipped row's error to the console. |
| `includeSourceDataInConsole` | `false` | Include the offending row's data in the console output. |
| `fileOutputMode` | unset | When set to a `FileOutputMode` value, errors are also written to a log file. |

`FileOutputMode`:

| Field | Default | Behaviour |
|---|---|---|
| `filePath` | (required) | Path of the error log file. |
| `contentType` | `METADATA` | What each log entry contains (see below). |
| `fileWriteOption` | `APPEND` | `APPEND` adds to an existing log file; `OVERWRITE` replaces the file on the first error of a parse, then appends the rest of that parse's errors. |

`ErrorLogContentType` selects the log-entry shape. The metadata entries are line-delimited JSON described by the public `LogOutput` record (optional `time`, `location`, `message`, and `offendingRow` fields), with `Location` carrying a 1-based `row` / `column` pair matching the Excel UI:

| Mode | Log-entry shape |
|---|---|
| `METADATA` | `{"time":"...","location":{"row":5,"column":2},"message":"..."}` |
| `RAW` | `["value1","value2",...]` — the offending row's data only |
| `RAW_AND_METADATA` | `{"time":"...","location":{...},"offendingRow":"[...]","message":"..."}` |

`failSafe` lives on the bulk-read types (`ParseOptions`, `TableParseOptions`) — it applies to `parseSheet`, `parseTable`, `Sheet.getRows`, and `Table.getRows`. When set, row-level errors (`TypeConversionError`, `ConstraintValidationError`) are logged and the offending row is skipped. Single-row reads (`Sheet.getRow`, `Table.getRow`) are fail-fast and have no `failSafe`. Structural errors always fail immediately.

---

## 4. Annotations

### 4.1 @xlsx:Name

Maps a record field to a specific Excel column header when the two names differ. The annotation is declared on record fields and takes a single `value` string — the Excel column header. Bidirectional — used on both read and write; fields without it use the field name as the header. Annotation values are trimmed on lookup, so accidental surrounding whitespace does not break matching.

Example:

```ballerina
type Employee record {|
    @xlsx:Name {value: "First Name"}
    string firstName;
    @xlsx:Name {value: "Employee ID"}
    int id;
|};
```

---

## 5. Simple API

The simple API consists of two functions for one-shot file-based operations. Both open and close the workbook within the call.

### 5.1 parseSheet

```ballerina
public isolated function parseSheet(string path,
        string|int sheet = 0,
        ParseOptions options = {},
        typedesc<Row> t = <>)
    returns t[]|Error;
```

Reads the specified sheet from an XLSX file and binds rows to the target type inferred from the call site.

| Parameter | Default | Meaning |
|---|---|---|
| `path` | (required) | Path to the XLSX file. |
| `sheet` | `0` | Sheet selector — sheet name (`string`) or 0-based index (`int`). |
| `options` | `{}` | `ParseOptions` (see [3.1](#31-sheet-read-options)). |
| `t` | inferred | Target row type — a `Row` member (record, `map<CellValue>`, or `string[]`). Function returns `t[]`. See [2.1](#21-row-and-cellvalue). |

Examples:

```ballerina
// Parse first sheet as typed records.
Employee[] employees = check xlsx:parseSheet("staff.xlsx");

// Parse named sheet, raw.
string[][] rows = check xlsx:parseSheet("report.xlsx", "Q1");

// Parse with options.
Employee[] data = check xlsx:parseSheet("report.xlsx", 1,
        {headerRowIndex: 2, caseInsensitiveHeaders: true});
```

### 5.2 writeSheet

```ballerina
public isolated function writeSheet(Row[] data,
        string path,
        string sheetName = "Sheet1",
        *SheetWriteOptions options)
    returns Error?;
```

Writes data to a sheet in an XLSX file. If the file already exists it is opened and **only the named sheet is affected** — every sibling sheet, their tables, and formulas are preserved; if the file does not exist, it is created with the single sheet. The write is atomic — on failure, the original file is untouched.

By default (`sheetWriteMode = FAIL_IF_EXISTS`) the write fails if the named sheet already exists, so no data is overwritten by accident. Writing into an existing sheet is opted into explicitly:

| `sheetWriteMode` | Behaviour when the target sheet already exists |
|---|---|
| `FAIL_IF_EXISTS` (default) | Error — nothing is written. |
| `REPLACE` | The sheet is dropped and recreated at the same tab position (its own formatting and any table on it are lost); siblings are kept. |
| `APPEND` | Rows are added below the existing data, aligned to the existing header by column name (record/map) or positionally (`string[][]`). `startRowIndex` is ignored, and a record/map write needs an existing header row. |

| Parameter | Default | Meaning |
|---|---|---|
| `data` | (required) | Rows to write — `Row[]`. |
| `path` | (required) | XLSX file path — opened if it exists, created otherwise. |
| `sheetName` | `"Sheet1"` | Name of the target sheet. |
| `*options` | (defaults) | `SheetWriteOptions` spread as named arguments — `sheetWriteMode`, `writeHeaders`, `startRowIndex` (see [3.3](#33-write-options)). |

Examples:

```ballerina
Employee[] employees = [{name: "John", age: 30}, {name: "Jane", age: 25}];

check xlsx:writeSheet(employees, "out.xlsx");

check xlsx:writeSheet(employees, "report.xlsx", "Staff", sheetWriteMode = REPLACE);

check xlsx:writeSheet(employees, "report.xlsx", "Staff", sheetWriteMode = APPEND);
```

**The target sheet is a data-only pipe.** Within the sheet being written, a `parseSheet → writeSheet` cycle does not preserve formulas, formatting, comments, charts, or Excel Tables — but other sheets in the file are untouched. Writing into an existing file loads the whole workbook into memory; prefer a fresh path for one-shot exports.

### 5.3 parseTable

```ballerina
public isolated function parseTable(string path,
        string tableName,
        TableParseOptions options = {},
        typedesc<Row> t = <>)
    returns t[]|Error;
```

Reads from an Excel Table (ListObject) by name. Tables are unique by name across the entire workbook, so no sheet specifier is needed. Headers are taken from the table's own header row.

| Parameter | Default | Meaning |
|---|---|---|
| `path` | (required) | Path to the XLSX file. |
| `tableName` | (required) | Name of the table. Raises `TableNotFoundError` if no matching table exists in any sheet. |
| `options` | `{}` | `TableParseOptions` (see [3.2](#32-table-read-options)). A table is self-describing, so there are no `headerRowIndex` / `dataStartRowIndex` fields; `rowCount`, `formulaMode`, `enableConstraintValidation`, `caseInsensitiveHeaders`, `allowDataProjection`, and `failSafe` apply normally. |
| `t` | inferred | Target row type — a `Row` member (record, `map<CellValue>`, or `string[]`). Function returns `t[]`. |

Example:

```ballerina
type Sale record {| string product; int quantity; decimal price; |};
Sale[] sales = check xlsx:parseTable("sales.xlsx", "SalesTable");
```

### 5.4 writeTable

```ballerina
public isolated function writeTable(Row[] data,
        string path,
        string tableName,
        *TableWriteOptions options)
    returns Error?;
```

Writes data to an existing Excel Table. By default (`tableWriteMode = REPLACE`) the table's data is replaced and the data range is **resized to fit the data exactly** — it grows or shrinks, so no stale rows survive inside the table (an empty array clears the table to a single blank data row). `tableWriteMode = APPEND` adds the rows below the existing data (or at `insertAt`, a 0-based data-row index) instead. The totals row, if any, and any content below the table are carried along by the resize; a resize that would shift **another** table fails with a `TableOverlapError` and writes nothing. The surrounding workbook (other sheets, named ranges, charts, formulas in unaffected cells) is preserved, and the write is atomic.

| Parameter | Default | Meaning |
|---|---|---|
| `data` | (required) | Rows to write — `Row[]`. |
| `path` | (required) | Path to the XLSX file containing the table. |
| `tableName` | (required) | Name of the table to write into. Raises `TableNotFoundError` if no matching table exists. |
| `options` | `{}` | `TableWriteOptions` — `tableWriteMode` (`REPLACE` default / `APPEND`) and `insertAt` (APPEND-only 0-based data-row index; `()` = bottom). |

Example:

```ballerina
Sale[] sales = [{product: "Widget", quantity: 100, price: 9.99d}];
check xlsx:writeTable(sales, "sales.xlsx", "SalesTable");
```

---

## 6. Workbook API

The Workbook API exposes a stateful workbook object with explicit lifecycle. A workbook and the `Sheet` and `Table` handles obtained from it are not safe for concurrent mutation.

### 6.1 Construction

Empty workbooks are constructed with `new`. To open an existing workbook from
disk or memory, use the module-level factory functions `xlsx:fromFile(path)`
and `xlsx:fromBytes(bytes)`:

```ballerina
xlsx:Workbook wb1 = new;
xlsx:Workbook wb2 = check xlsx:fromFile("report.xlsx");
xlsx:Workbook wb3 = check xlsx:fromBytes(sourceBytes);
```

| Form | Semantics |
|---|---|
| `new` | Empty in-memory workbook. No source path bound. `save()` errors; `saveAs(path)` is required to persist. |
| `xlsx:fromFile(string path)` | Opens an existing file. Errors with `FileNotFoundError` if the path does not exist. To create a new file with a specific name, use `new` followed by `saveAs(path)`. |
| `xlsx:fromBytes(byte[] bytes)` | Opens the workbook represented by the byte array. No source path; `saveAs(path)` is required for file-based persistence. |

### 6.2 Workbook class

`Workbook` exposes three method groups. All methods return `|Error`, and every method on a closed workbook returns a typed `Error` rather than panicking.

**Sheet access.** Sheet name lookups are case-insensitive, matching Excel's own semantics.

| Method | Behaviour |
|---|---|
| `getSheetNames()` | Names of all sheets, in tab order. |
| `getSheetCount()` | Number of sheets. |
| `hasSheet(name)` | Whether a sheet with the name exists. |
| `getSheet(name\|index)` | Returns the `Sheet` by name or 0-based index; `SheetNotFoundError` if absent. |
| `createSheet(name)` | Creates and returns a new sheet. `SheetExistsError` for a duplicate name; the name must satisfy Excel's rules (1–31 characters, none of `\ / ? * [ ] :`). |
| `deleteSheet(name\|index)` | Deletes the sheet and invalidates any vended handles to it; `SheetNotFoundError` if absent. Deleting the last sheet is refused (Excel rejects sheet-less workbooks). |

**Table access.** Tables are unique by name across the workbook.

| Method | Behaviour |
|---|---|
| `getTable(name)` | Returns the `Table` by name from any sheet; `TableNotFoundError` if absent. |
| `getAllTables()` | Every table in the workbook. |

**Lifecycle.**

| Method | Behaviour |
|---|---|
| `save()` | Overwrites the source path bound at construction (or by a previous `saveAs`). Errors for in-memory workbooks with no source path. |
| `saveAs(path)` | Writes to `path` and binds the workbook to it, so subsequent `save()` calls write there. |
| `toBytes()` | Serializes the current workbook state as XLSX bytes — for HTTP / SFTP transfer without going through disk. |
| `close()` | Releases native resources and invalidates the workbook and all vended handles. |

Both file writes are atomic — temp file in the same directory + atomic rename. A failed write never destroys the original file.

**`close()`** is required for resource hygiene. A phantom-reference cleanup thread catches workbooks that escape without `close()`, but explicit close is the contract.

---

## 7. Sheet API

`Sheet` is an object type — instances are obtained from a `Workbook` (`getSheet`, `createSheet`); it cannot be constructed directly with `new`.

**Identity and dimensions.**

| Method | Behaviour |
|---|---|
| `getName()` | The sheet's name. |
| `getUsedRange()` | The used range in A1 notation (e.g., `"A1:D50"`). |
| `getUsedCellRange()` | The used range as a 0-based `CellRange`; `()` for an empty sheet. |
| `getRowCount()` / `getColumnCount()` | Dimensions of the used range. |

**Reads.** All reads follow the binding and options semantics of the simple API ([5.1](#51-parsesheet), [3.1](#31-sheet-read-options)).

| Method | Behaviour |
|---|---|
| `getRows(options, t)` | Bulk read into `t[]` — the sheet-level equivalent of `parseSheet`. |
| `getRow(index, options, t)` | The single data row at `dataStartRowIndex + index`. Fail-fast: no `failSafe`. |
| `getColumn(columnRef, options, t)` | One column's cells. `columnRef` is a header name (`string`; honours `caseInsensitiveHeaders`) or a 0-based index (`int`). |
| `getCell(rowIndex, columnIndex, t)` | One cell bound to the target type `t` (default `CellValue`). The default yields the cell's natural value (a date/time cell becomes an ISO `string`); pinning `time:Civil` / `time:Date` / `time:TimeOfDay` (or a scalar) yields that type. A blank cell is `()` for a target that admits it, or an error for a non-nilable scalar target. |

**Writes.**

| Method | Behaviour |
|---|---|
| `putRows(data, *WriteOptions)` | Bulk write; `APPEND` by default (see [3.3](#33-write-options)). |
| `setRow(rowIndex, data, *RowWriteOptions)` | Writes one row; `REPLACE` by default. |
| `setColumn(columnRef, data)` | Writes a column of `CellValue`s, addressed like `getColumn`. |
| `setCell(rowIndex, columnIndex, value)` | Writes one cell. |
| `setCellByAddress(cellAddress, value)` | Writes one cell addressed in A1 notation (e.g., `"B2"`). |

**Sheet management and tables.**

| Method | Behaviour |
|---|---|
| `deleteRow(index)` | Removes the row and shifts subsequent rows up by one to preserve dense indexing. Refused with a `TableOverlapError` if the shift would move a table's cells (moving them but not the table's definition) — use `Table.deleteRow` to delete a row from inside a table. |
| `rename(newName)` | Renames the sheet; Excel's sheet-name rules apply. |
| `getTable(name)` / `getTables()` | Tables anchored on this sheet; `TableNotFoundError` for a missing name. |
| `createTable(name, range, headers)` | Creates a table over a `CellRange` or A1-string range. The range's first row is the table's header row; the optional `headers` values override the header names. |
| `createTableFromData(name, data, startRowIndex, startColumnIndex)` | Creates a table sized to `data` at the given origin (default `0, 0`). |
| `deleteTable(name)` | Deletes the table and invalidates its vended handles. |

---

## 8. Table API

`Table` is an object type — instances are obtained from a `Workbook` or `Sheet` (see below); it cannot be constructed directly with `new`.

**Identity, range, and dimensions.**

| Method | Behaviour |
|---|---|
| `getName()` / `getDisplayName()` / `getSheetName()` | The table's name, display name, and owning sheet. |
| `getRange()` / `getCellRange()` | The full table range (header, data, and totals row) in A1 notation / as a 0-based `CellRange`. |
| `getDataRange()` / `getDataCellRange()` | The data rows only, in the same two forms. |
| `getRowCount()` | Number of data rows (header and totals row excluded). |
| `getColumnCount()` | Number of columns. |

**Headers and data.** Reads follow the table-read semantics of [5.3](#53-parsetable) and [3.2](#32-table-read-options).

| Method | Behaviour |
|---|---|
| `getHeaders()` | Header names from the table's own header row. |
| `getRows(options, t)` | Bulk read into `t[]` — the handle-level equivalent of `parseTable`. |
| `getRow(index, options, t)` | One data row (0-based within the data range). Fail-fast: no `failSafe`. |
| `putRows(data, *TableWriteOptions)` | Replaces or appends the table's data (see [3.3](#33-write-options) and the resize semantics below). |
| `hasTotalRow()` | Whether the table has a totals row. |
| `getTotalRow(t)` | The totals row's values as a `map<CellValue>` keyed by header. Errors when the table has no totals row — check with `hasTotalRow()` first. |

**Modification.**

| Method | Behaviour |
|---|---|
| `rename(newName)` | Renames the table; table-name rules apply (1–255 characters, starts with a letter or underscore, no spaces), and a duplicate name is a `TableExistsError`. |
| `resize(newRange)` | Changes the table's range to a `CellRange` or A1 string (see the resize semantics below). A range that lacks a header row plus at least one data row, or lies outside the sheet bounds, is an `InvalidTableRangeError`; a range that would collide with another table is a `TableOverlapError`. |
| `deleteRow(index)` | Deletes one data row, shrinking the table to fit (see below). |

Tables are obtained from `Workbook.getTable(name)`, `Workbook.getAllTables()`, `Sheet.getTable(name)`, `Sheet.getTables()`, `Sheet.createTable(...)`, or `Sheet.createTableFromData(...)`. Table names are unique across the entire workbook.

`Table.putRows` resizes the underlying `XSSFTable` to fit the incoming data — growing or shrinking the data range under the default `REPLACE`, or adding rows below the existing data (or at `insertAt`, a 0-based data-row index) under `APPEND` (see [3.3](#33-write-options)). The totals row and any content below the table are carried along by the resize; a resize that would shift another table fails with a `TableOverlapError`. Conversely, inserting *sheet* rows (`Sheet.putRows` / `setRow` with `APPEND`) into a table's region is refused with the same error — modify a table through the Table API rather than by shifting its rows from the sheet.

`Table.deleteRow(index)` deletes a single data row (0-based within the data range), shrinking the table to fit: the totals row and any content below move up to close the gap. An index outside the data range is refused with an `InvalidTableRangeError` — as is deleting the only remaining data row, since a table must keep at least one; a delete that would shift another table fails with a `TableOverlapError`.

---

## 9. Error Types

Every module error is a subtype of the base `Error` type, which carries `ErrorDetails`. The subtypes fall into two behavioural groups.

**Structural errors** — always fail immediately, regardless of `failSafe`:

- `ParseError` — the file is not a workbook the module can process.
- `FileNotFoundError` — the given path does not exist.
- `SheetNotFoundError` / `SheetExistsError` — a sheet lookup failed / the target sheet already exists (`writeSheet`'s default mode, `createSheet`).
- `TableNotFoundError` / `TableExistsError` — a table lookup failed / a table with the name already exists.
- `TableOverlapError` — an operation would move another table's cells without moving its definition (a sheet-row insert or delete through a table's region, or a table resize collision).
- `InvalidTableRangeError` — a table range is malformed or not permitted.

**Row-level errors** — fail immediately by default; with `failSafe` set, the offending row is logged and skipped:

- `TypeConversionError` — a cell value cannot bind to the target field type.
- `ConstraintValidationError` — a parsed record failed its `@constraint` annotations. Chains the underlying `constraint:Error` as its cause and records the offending field in `ErrorDetails.fieldName` when determinable.

**`ErrorDetails`** — every field optional, populated when determinable:

| Field | Meaning |
|---|---|
| `sheetName` / `tableName` | The sheet / table involved. |
| `cellAddress` | A1 notation, e.g. `"B5"`. |
| `rowNumber` / `columnNumber` | 1-based, matching the Excel UI. |
| `fieldName` | The record field involved (e.g., the field that failed constraint validation). |

**Index conventions:** option fields (`headerRowIndex`, `dataStartRowIndex`, `startRowIndex`) and `CellRange` are **0-based**; `ErrorDetails.rowNumber`/`columnNumber` and `Location` are **1-based**, matching the Excel UI. Code that feeds error locations back into option values must convert between the two.

---

## 10. Samples

### 10.1 Parse to records

```ballerina
import ballerina/xlsx;

type Employee record {|
    string name;
    int age;
    decimal salary;
|};

public function main() returns error? {
    Employee[] employees = check xlsx:parseSheet("staff.xlsx");
    foreach Employee emp in employees {
        // process each employee
    }
}
```

### 10.2 Write from records

```ballerina
import ballerina/xlsx;

type Employee record {|
    string name;
    int age;
    decimal salary;
|};

public function main() returns error? {
    Employee[] employees = [
        {name: "Alice", age: 30, salary: 75000d},
        {name: "Bob", age: 25, salary: 60000d}
    ];
    check xlsx:writeSheet(employees, "staff.xlsx", sheetName = "Employees");
}
```

### 10.3 Header mapping with @xlsx:Name

```ballerina
import ballerina/xlsx;

type Employee record {|
    @xlsx:Name {value: "First Name"}
    string firstName;
    @xlsx:Name {value: "Employee ID"}
    int id;
|};

public function main() returns error? {
    // Excel columns: "First Name" | "Employee ID"
    Employee[] employees = check xlsx:parseSheet("staff.xlsx");

    // Round-trips: write produces the same "First Name" / "Employee ID" headers.
    check xlsx:writeSheet(employees, "staff-out.xlsx");
}
```

### 10.4 Multi-sheet Workbook operations

```ballerina
import ballerina/xlsx;

type Sale record {| string product; int quantity; decimal price; |};

public function main() returns error? {
    xlsx:Workbook wb = check xlsx:fromFile("sales.xlsx");

    // Read from one sheet, modify, write to another.
    xlsx:Sheet rawSheet = check wb.getSheet("Raw");
    Sale[] sales = check rawSheet.getRows();

    Sale[] highValue = from Sale s in sales where s.price > 100d select s;

    xlsx:Sheet summarySheet = check wb.createSheet("HighValue");
    check summarySheet.putRows(highValue);

    check wb.save();
    check wb.close();
}
```

### 10.5 Excel Tables

Two paths, depending on whether you need the broader workbook context.

**Tier 1 — one-shot table read/write:**

```ballerina
import ballerina/xlsx;

type Employee record {| string name; int age; |};

public function main() returns error? {
    // Read all rows of a named table.
    Employee[] employees = check xlsx:parseTable("data.xlsx", "EmployeeTable");

    // Add a row and write the whole set back. REPLACE (default) resizes the table to fit.
    Employee[] withNew = [...employees, {name: "Charlie", age: 35}];
    check xlsx:writeTable(withNew, "data.xlsx", "EmployeeTable");
}
```

**Workbook API — when you need totals row, rename/resize, or coordination with other operations:**

```ballerina
import ballerina/xlsx;

type Employee record {| string name; int age; |};

public function main() returns error? {
    xlsx:Workbook wb = check xlsx:fromFile("data.xlsx");

    xlsx:Table empTable = check wb.getTable("EmployeeTable");
    Employee[] employees = check empTable.getRows();

    if check empTable.hasTotalRow() {
        map<xlsx:CellValue> totals = check empTable.getTotalRow();
        // ... inspect totals ...
    }

    Employee[] newEmployees = [...employees, {name: "Charlie", age: 35}];
    check empTable.putRows(newEmployees);

    check wb.save();
    check wb.close();
}
```

### 10.6 Bytes in, bytes out

```ballerina
import ballerina/ftp;
import ballerina/xlsx;

type Order record {| int id; string customer; decimal amount; |};

public function main() returns error? {
    ftp:Client sftp = check new ({host: "sftp.example.com"});

    // Pull bytes from SFTP, open as a workbook.
    byte[] inputBytes = check sftp->get("/in/orders.xlsx");
    xlsx:Workbook wb = check xlsx:fromBytes(inputBytes);

    xlsx:Sheet sheet = check wb.getSheet(0);
    Order[] orders = check sheet.getRows();

    // Enrich and write back into the same sheet.
    Order[] enriched = from Order o in orders select {...o, amount: o.amount * 1.1d};
    check sheet.putRows(enriched);

    // Serialise and upload.
    byte[] outputBytes = check wb.toBytes();
    check sftp->put("/out/orders-enriched.xlsx", outputBytes);

    check wb.close();
}
```

**Memory note:** the bytes path sustains roughly 1.5–2.5× the DOM heap for the workbook's lifetime (the underlying parser inflates every zip entry up front), while the file path runs at ~1.0×. For large workbooks, write the downloaded payload to a temp file and open it with `xlsx:fromFile` instead.

### 10.7 Fail-safe error handling

```ballerina
import ballerina/xlsx;

type Employee record {|
    string name;
    int age;
|};

public function main() returns error? {
    // Bad rows logged to a file; parse returns the good rows.
    Employee[] employees = check xlsx:parseSheet("messy.xlsx", 0, {
        failSafe: {
            enableConsoleLogs: true,
            includeSourceDataInConsole: true,
            fileOutputMode: {
                filePath: "./errors.log",
                contentType: RAW_AND_METADATA,
                fileWriteOption: APPEND
            }
        }
    });
    // Use the cleaned-up records.
}
```

### 10.8 Date and time binding

The binder uses the target field type to decide what shape to produce. Declare the field as `time:Civil` / `time:Date` / `time:TimeOfDay` for typed values, or as `string` for ISO 8601.

```ballerina
import ballerina/xlsx;
import ballerina/time;

type Transaction record {|
    int id;
    time:Civil timestamp;     // date-time cell → time:Civil
    time:Date settledOn;      // date-only cell → time:Date
    decimal amount;
|};

public function main() returns error? {
    Transaction[] txns = check xlsx:parseSheet("transactions.xlsx");

    // Work with the values as time records — no manual parsing.
    foreach Transaction t in txns {
        if t.settledOn.year >= 2026 {
            // ...
        }
    }

    // Writing back produces date-formatted cells, not text cells.
    check xlsx:writeSheet(txns, "transactions-out.xlsx");
}
```

If you prefer ISO strings (e.g., when the target type is dynamic), declare the fields as `string`:

```ballerina
type RawTxn record {|
    int id;
    string timestamp;         // "2026-05-24T10:30:00"
    string settledOn;         // "2026-05-24"
    decimal amount;
|};

RawTxn[] raw = check xlsx:parseSheet("transactions.xlsx");
```

### 10.9 Large integer IDs

Integers with absolute value greater than `2^53` (≈ 9 × 10^15) cannot be represented exactly as IEEE-754 doubles, which is how Excel stores numeric cells. The module writes all integers as numeric cells — values beyond `2^53` **lose precision silently**, matching what Apache POI, openpyxl, and Excel itself do.

To preserve 16+ digit identifiers (account numbers, order IDs, transaction references) exactly, declare the field as `string`:

```ballerina
import ballerina/xlsx;

type Order record {|
    string orderId;           // e.g., "4929187654321098765" — 19 digits, preserved exactly
    string customer;
    decimal amount;
|};

public function main() returns error? {
    Order[] orders = [
        {orderId: "4929187654321098765", customer: "Acme", amount: 99.99d}
    ];

    // The orderId is written as a text cell. The digits round-trip exactly.
    check xlsx:writeSheet(orders, "orders.xlsx");

    Order[] readBack = check xlsx:parseSheet("orders.xlsx");
    // readBack[0].orderId == "4929187654321098765" — preserved
}
```

With an `int` field instead, the same value would silently round (e.g., to `4929187654321098752`) — the cell stays numeric, exactly as if the number had been typed into Excel by hand. In Excel the `string`-field cells appear as text (left-aligned, no numeric formatting).
