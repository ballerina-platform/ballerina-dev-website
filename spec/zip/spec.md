# Specification: Ballerina Zip Library

_Owners_: @niveathika @Nuvindu  
_Reviewers_: @niveathika  
_Created_: 2026/08/14  
_Updated_: 2026/08/19  
_Edition_: Swan Lake

## Introduction

This is the specification for the Zip library of the [Ballerina language](https://ballerina.io/). The library creates ZIP files, reads them, and extracts what is inside them.

This specification may change in future versions. Released versions can be found under the matching GitHub tag.

If you have feedback or suggestions, start a discussion with a [GitHub issue](https://github.com/ballerina-platform/module-ballerina-zip/issues). The specification and the implementation can then be updated together.

The implementation that matches this specification is released with the library. Anything the library does differently from this document is a bug.

## Contents

1. [Overview](#1-overview)
2. [Concepts](#2-concepts)
    * 2.1. [Archive](#21-archive)
    * 2.2. [Entry](#22-entry)
    * 2.3. [Compression method and level](#23-compression-method-and-level)
3. [Errors](#3-errors)
4. [Reading an archive](#4-reading-an-archive)
    * 4.1. [Opening](#41-opening)
    * 4.2. [Listing entries](#42-listing-entries)
    * 4.3. [Reading entry content](#43-reading-entry-content)
    * 4.4. [Extracting](#44-extracting)
    * 4.5. [Closing](#45-closing)
5. [Creating an archive](#5-creating-an-archive)
    * 5.1. [Opening](#51-opening)
    * 5.2. [Adding entries](#52-adding-entries)
    * 5.3. [Copying entries between archives](#53-copying-entries-between-archives)
    * 5.4. [Closing](#54-closing)
6. [Convenience API](#6-convenience-api)
7. [Entry names](#7-entry-names)
    * 7.1. [Separator and normalization](#71-separator-and-normalization)
    * 7.2. [Directory entries](#72-directory-entries)
    * 7.3. [Duplicate names](#73-duplicate-names)
    * 7.4. [Character encoding](#74-character-encoding)
8. [Security](#8-security)
    * 8.1. [Unsafe entry names](#81-unsafe-entry-names)
    * 8.2. [Extraction limits](#82-extraction-limits)
9. [Resource and memory characteristics](#9-resource-and-memory-characteristics)
10. [Portability constraints](#10-portability-constraints)
11. [Not supported in this version](#11-not-supported-in-this-version)

## 1. Overview

This library works with ZIP files, the format described by the PKWARE APPNOTE specification. There are two ways to use it.

The **convenience API** does the common jobs in a single call. Zip a folder, unzip a file, list what is inside.

```ballerina
check zip:compress("./reports", "./reports.zip");
check zip:decompress("./reports.zip", "./out");
```

The **object API** lets you work file by file. Use `ArchiveReader` to read an existing zip, and `ArchiveWriter` to build a new one.

```ballerina
zip:ArchiveReader archive = check new ("./reports.zip");
zip:Entry[] entries = check archive.entries();
check archive.close();
```

The convenience API is built on top of the object API. Both follow the same rules for names, security, and errors.

## 2. Concepts

### 2.1. Archive

An archive is one ZIP file on disk. This library always works with a file path. It does not work with a zip held in memory.

You either open an existing archive to read it, or create a new one to write. You cannot change an archive that already exists. See [Section 11](#11-not-supported-in-this-version) for how to work around that.

### 2.2. Entry

An entry is one file or one folder stored inside an archive. A zip holding 40 files has 40 entries. Each entry has a name, a size, a compression method, a timestamp, and a checksum. The `Entry` record holds all of this.

```ballerina
public type Entry record {|
    string name;
    boolean isDirectory;
    boolean isSymlink;
    int uncompressedSize;
    int compressedSize;
    CompressionMethod method;
    time:Utc modifiedTime;
    int crc32;
    string comment?;
    int unixMode?;
|};
```

| Field | Meaning |
| --- | --- |
| `name` | Path of the entry inside the archive |
| `isDirectory` | Whether this entry is a folder |
| `isSymlink` | Whether this entry is a symbolic link |
| `uncompressedSize` | Size in bytes of the real content |
| `compressedSize` | Size in bytes as stored in the archive |
| `method` | How the entry was compressed |
| `modifiedTime` | When the file was last changed |
| `crc32` | Checksum of the real content, as an unsigned value |
| `comment` | Present only if the entry carries a comment |
| `unixMode` | Present only if the archive records Unix permissions |

`modifiedTime` is accurate to two seconds, which is all the format stores by default; archives that record a more precise time report that instead. An entry recording no time at all, and one recording a time before the epoch, both report the epoch.

`unixMode` reports the mode as the archive records it, including the setuid, setgid and sticky bits. It excludes the bits saying what kind of file it is, which is why `isSymlink` is a separate field. A symbolic link entry is visible when listing but cannot be extracted, per [Section 4.4](#44-extracting).

### 2.3. Compression method and level

The library compresses with two methods, and names a third for what it finds.

```ballerina
public enum CompressionMethod {
    STORE,
    DEFLATE,
    OTHER
}
```

`STORE` means the entry is kept as it is, with no compression. `DEFLATE` means the entry is squeezed smaller. `DEFLATE` is what the library uses by default.

Some zips contain entries compressed in older or unusual ways. Those archives can still be opened and listed, and such an entry is listed with its `method` as `OTHER`. Reading or extracting it returns an `UnsupportedEntryError`. Copying it into another archive works; see [Section 5.3](#53-copying-entries-between-archives).

`OTHER` is never written by this library. It says only that the method is one this library does not decompress, not which method it is.

When creating an archive, you choose how hard to squeeze.

```ballerina
public enum CompressionLevel {
    NONE,
    FASTEST,
    DEFAULT,
    BEST
}
```

`NONE` stores entries uncompressed, using the `STORE` method. `FASTEST`, `DEFAULT`, and `BEST` use `DEFLATE`, working progressively harder for a smaller result. The level affects output size only; every level produces a zip any tool can open.

## 3. Errors

Every function in this library returns either `zip:Error` or one of the types below it.

```ballerina
public type EntryErrorDetail record {
    string entryName;
};

public type Error distinct error;

public type InvalidArchiveError distinct Error;
public type EntryNotFoundError distinct Error;
public type UnsupportedEntryError distinct (Error & error<EntryErrorDetail>);
public type UnsafePathError distinct (Error & error<EntryErrorDetail>);
public type LimitExceededError distinct (Error & error<EntryErrorDetail>);
public type FileSystemError distinct Error;
```

| Error | When you get it |
| --- | --- |
| `InvalidArchiveError` | The file is not a zip, or it is damaged |
| `EntryNotFoundError` | There is no entry with that name |
| `UnsupportedEntryError` | The entry has a password on it, or uses a compression method this library cannot read |
| `UnsafePathError` | An entry would be written outside the folder you chose |
| `LimitExceededError` | Extraction went past one of the limits in [Section 8.2](#82-extraction-limits) |
| `FileSystemError` | A file could not be read, written, or created |

`UnsupportedEntryError`, `UnsafePathError`, and `LimitExceededError` carry a detail record naming the entry. The other three carry no details.

`FileSystemError` has no detail record. When extracting a whole archive fails on one entry, its message names that entry; it also covers failures with no entry behind them, such as being unable to create the target folder.

Error messages always come from this library. Messages from the compression library underneath are never passed through, so they stay the same if that library is replaced.

## 4. Reading an archive

### 4.1. Opening

Create an `ArchiveReader` with the path of a ZIP file.

```ballerina
zip:ArchiveReader archive = check new ("./reports.zip");
```

The file must exist and must be a real zip. If not, you get a `FileSystemError` or an `InvalidArchiveError`.

Opening reads the archive's index of entries into memory, in full. There is no limit on how many entries an archive may hold. The implementation must not allocate from the count declared in the archive's trailer, which can be untrue, so the memory this costs is bounded by the size of the file.

The archive stays open, holding the file, until you call `close`.

An `ArchiveReader` is read-only, and shows the archive as it was when you opened it. Later changes to the file are not seen.

### 4.2. Listing entries

```ballerina
public isolated function entries() returns Entry[]|Error;
public isolated function getEntry(string name) returns Entry|Error;
public isolated function hasEntry(string name) returns boolean|Error;
```

`entries` returns every entry, including folders, in the order they are stored in the archive. The order is never sorted.

`getEntry` returns the metadata of one entry by name, or an `EntryNotFoundError`. A zip is allowed to hold two entries with the same name. When that happens, you get the first one. See [Section 7.3](#73-duplicate-names).

`hasEntry` says whether the archive holds an entry with that name. It answers from the index already in memory and reads nothing.

The functions that take a name are named for what they give back: `getEntry` metadata, `readEntry` content ([Section 4.3](#43-reading-entry-content)), `extractEntry` a file on disk ([Section 4.4](#44-extracting)).

### 4.3. Reading entry content

```ballerina
public isolated function readEntry(string name,
        typedesc<byte[]|stream<byte[], Error?>> targetType = <>) returns targetType|Error;
```

The type you assign the result to decides how the content comes back.

```ballerina
byte[] content = check reader.readEntry("report.pdf");             // all at once
stream<byte[], Error?> chunks = check reader.readEntry("big.csv"); // in chunks
```

A `byte[]` holds the whole entry in memory; a stream holds one chunk. A stream also keeps a read position in the archive, so it has a lifetime of its own:

- More than one entry stream may be open at once, and they do not interfere.
- A stream read to the end releases its position. One abandoned part way through does not, so close it yourself.
- Closing the `ArchiveReader` closes any stream still open on it. Reading from one afterwards gives an `InvalidArchiveError`.

**Neither form has a size limit.** Choosing `byte[]` is choosing to allocate the whole entry; read as a stream when the entry could be any size. The limits in [Section 8.2](#82-extraction-limits) cover extraction only.

The chunk size of the stream form is unspecified; do not depend on a particular value.

Reading a folder entry gives nothing back. Reading an entry the library cannot decompress gives an `UnsupportedEntryError`.

### 4.4. Extracting

```ballerina
public isolated function extractEntry(string name, string targetPath,
        DecompressOptions options = {}) returns Error?;
public isolated function extractAll(string targetPath, DecompressOptions options = {}) returns Error?;
```

`extractEntry` writes one entry to the file path you give. The folder it goes in must already exist.

`extractAll` writes every entry into the folder you give, in the order the entries are stored in the archive, creating that folder and any folders below it as needed. Folders are created for any entry name that contains a `/`, whether or not the archive records the folder itself.

```ballerina
public type DecompressOptions record {|
    FileWriteMode fileWriteMode = FAIL_IF_EXISTS;
    ExtractionLimits limits = {};
|};
```

`fileWriteMode` decides what happens when a file is already sitting where an entry would be written.

```ballerina
public enum FileWriteMode {
    FAIL_IF_EXISTS,
    REPLACE,
    SKIP
}
```

| Mode | What happens |
| --- | --- |
| `FAIL_IF_EXISTS` | Extraction stops with a `FileSystemError`. This is the default |
| `REPLACE` | The existing file is replaced |
| `SKIP` | The existing file is left alone, and extraction carries on with the next entry |

`SKIP` suits extracting into a folder that already holds some of the files, but it hides collisions: nothing reports which entries were skipped.

The mode applies to files only. Whatever the mode says, an existing folder is reused, and a file entry whose target is an existing folder gives a `FileSystemError`.

Both functions apply the name checks in [Section 8.1](#81-unsafe-entry-names). `extractAll` also applies the limits in [Section 8.2](#82-extraction-limits).

If extraction fails halfway, files already written are left in place; nothing is cleaned up. For all-or-nothing behaviour, extract into a temporary folder and move it once it succeeds.

The timestamp is set on each extracted file, or skipped if the platform cannot store it.

**Symbolic links are never created.** An entry marked as a link gives an `UnsupportedEntryError`.

Unix permissions recorded in an archive are not applied. An extracted file gets whatever permissions the platform gives a newly created file. `Entry.unixMode` reports what the archive holds. See [Section 11](#11-not-supported-in-this-version).

### 4.5. Closing

```ballerina
public isolated function close() returns Error?;
```

`close` releases the file. Calling any other method afterwards gives you an `InvalidArchiveError`. Calling `close` twice is fine.

Ballerina does not close these objects for you, so an unclosed `ArchiveReader` holds a file open for the life of the program. Callers that do not need entry-level control should use the convenience API in [Section 6](#6-convenience-api), which closes everything itself.

## 5. Creating an archive

### 5.1. Opening

```ballerina
zip:ArchiveWriter writer = check new ("./reports.zip");
zip:ArchiveWriter writer = check new ("./reports.zip", {level: BEST});
```

**A file already at that path is not replaced.** You get a `FileSystemError`, and the file is left as it was.

```ballerina
zip:ArchiveWriter writer = check new ("./reports.zip", {overwrite: true});
```

Set `overwrite` to replace what is there. The file is then truncated at this moment, not on success. If a later call fails, or `close` is never reached, the previous contents are gone and what remains is not a valid zip. Write to a temporary path and move it into place if that matters.

Whether the path is free is decided by the same operation that creates the file, not by a check made beforehand, so nothing can appear in between.

```ballerina
public type CompressOptions record {|
    CompressionLevel level = DEFAULT;
    boolean includeSourceDirectory = true;
    boolean overwrite = false;
|};
```

`level` applies to every entry added through this writer. `includeSourceDirectory` is used only by `addDirectory` and the convenience API. See [Section 5.2](#52-adding-entries).

The archive is not finished until you call `close`. A writer that is abandoned without closing leaves behind a file that is not a valid zip.

### 5.2. Adding entries

```ballerina
public isolated function addFile(string sourcePath, string? entryName = ()) returns Error?;
public isolated function addDirectory(string sourcePath, string? entryName = ()) returns Error?;
public isolated function addEntry(string entryName,
        byte[]|stream<byte[], error?> content) returns Error?;
```

Entries are written in the order you add them.

`addFile` reads a file from disk. If you do not give an `entryName`, the file name is used on its own, without the folders above it.

Which files you may read is not restricted. A supplied `entryName` must obey [Section 7.1](#71-separator-and-normalization): a name that is empty or absolute, or that starts with a drive letter, or that holds a `.` or `..` part, a `\`, or a `:`, gives an `UnsafePathError` rather than being silently corrected.

```ballerina
check writer.addFile("/etc/passwd");                  // stored as "passwd"
check writer.addFile("/etc/passwd", "/etc/passwd");   // UnsafePathError
```

`addDirectory` adds a folder and everything inside it, going all the way down.

- When `includeSourceDirectory` is `true`, the folder itself becomes the top level. Adding `./reports` gives you entries named `reports/...`.
- When it is `false`, the contents go straight into the top level of the zip.
- An `entryName` you supply names the top level, whichever way the option is set: `addDirectory("./reports", "docs")` gives entries named `docs/...`. The option shapes only a call that names nothing.
- Shortcuts and symbolic links **found inside the folder** are skipped. Neither the link nor the file it points to is stored.
- An empty folder is recorded as a folder entry when there is a top level to record it under, which means `includeSourceDirectory` is on or an `entryName` was given. A call that names nothing with the option off adds nothing.

A `sourcePath` you name yourself is used as given: if it is a link to a folder, that folder is the one added. The same holds for `addFile` and for `compress`.

`addEntry` adds an entry whose content you supply rather than read from disk. `entryName` is required.

When the content is a stream, `addEntry` reads it and closes it, on a refusal as much as on a success.

A name ending in `/` records a folder, which holds nothing. `addFile` and `addEntry` refuse content given under such a name.

The timestamp is the source file's last modified time for `addFile` and `addDirectory`, and the current time for `addEntry`. On Unix-like systems, `addFile` and `addDirectory` also record the source permissions.

### 5.3. Copying entries between archives

```ballerina
public isolated function copyEntry(ArchiveReader sourceArchive, string entryName) returns Error?;
```

`copyEntry` takes an entry from another archive **without unpacking it**. Content, compression method, timestamp, and checksum are kept exactly; the `level` on this writer does not apply.

This is how you make a changed copy of an existing zip. To drop a file: open the archive, create a writer, and copy across every entry except that one.

`sourceArchive` must still be open. An entry may be copied even if this library cannot decompress its content. An encrypted entry is the exception, and gives an `UnsupportedEntryError`.

### 5.4. Closing

```ballerina
public isolated function close() returns Error?;
```

`close` writes the index of entries and releases the file. **The archive is only valid once this succeeds.** Calling any other method afterwards gives you an `InvalidArchiveError`.

## 6. Convenience API

```ballerina
public isolated function compress(string sourcePath, string targetPath, CompressOptions options = {}) returns Error?;
public isolated function decompress(string sourcePath, string targetPath, DecompressOptions options = {}) returns Error?;
public isolated function listEntries(string path) returns Entry[]|Error;
```

`compress` puts a file or a folder into a new zip. If `sourcePath` is a single file, the zip holds that one entry and `includeSourceDirectory` does nothing. If it is a folder, it behaves like `ArchiveWriter.addDirectory`.

`targetPath` must not be inside `sourcePath`, and must not be `sourcePath` itself. Such a call gives a `FileSystemError` before anything is written. An existing file at `targetPath` gives a `FileSystemError` too, unless `overwrite` is set, as in [Section 5.1](#51-opening).

`decompress` extracts everything into a folder. It behaves like `ArchiveReader.extractAll`.

`listEntries` lists what is inside an archive. It behaves like `ArchiveReader.entries`.

Each of these opens what it needs and closes it before returning, including when it returns an error.

## 7. Entry names

### 7.1. Separator and normalization

Names inside a zip always use `/` to separate folders, on every platform. This is what the ZIP format requires. The library converts separators when entries are added, and converts them back to the platform separator when entries are extracted.

Names inside a zip are always relative. The library never writes a name that is empty, that starts at the root of the disk, that starts with a drive letter, or that contains a `.` or `..` part.

A `\` is never allowed in a name, in either direction: writing one is refused, and an archive containing one is refused when extracted. A `:` is refused the same way, wherever in the name it appears.

Names are compared exactly, including case. A zip may hold two names differing only in case; on Windows and macOS the second lands on the file the first wrote, so `fileWriteMode` decides the outcome.

### 7.2. Directory entries

A folder entry has a name ending in `/` and no content. `Entry.isDirectory` is `true` for those.

A zip does not have to record its folders. Extraction creates whatever folders the entry names imply.

### 7.3. Duplicate names

The ZIP format allows two entries with the same name, and archives made by other tools sometimes contain them. `entries` returns all of them.

`getEntry`, `hasEntry`, `readEntry`, `extractEntry`, and `copyEntry` all work on the **first** entry with that name, without exception. A later duplicate is therefore visible through `entries()` but cannot be reached; see [Section 11](#11-not-supported-in-this-version).

Extraction processes duplicates in stored order, so `fileWriteMode` decides the outcome:

| Mode | Result |
| --- | --- |
| `FAIL_IF_EXISTS` | `FileSystemError` on the second, the default |
| `REPLACE` | The last duplicate wins |
| `SKIP` | The first is kept |

### 7.4. Character encoding

Names are always written as UTF-8, and entries written by this library are flagged as UTF-8.

When reading, the flag on each entry decides how its name is decoded:

| Flag | Decoded as |
| --- | --- |
| Set | UTF-8 |
| Clear | CP437 |

CP437 is what the ZIP format specifies for names without the flag. It maps all 256 byte values, so decoding never fails and every name has one definite value.

There is no option to choose a character set. An archive storing names in some third character set, without saying so, decodes to the wrong text.

The checks in [Section 8.1](#81-unsafe-entry-names) run on the decoded name. An entry whose raw bytes contain a `\` or a zero byte is refused before decoding.

## 8. Security

### 8.1. Unsafe entry names

Two paths are involved when extracting, and only one is restricted.

- **The folder you extract into.** You choose it, and it may be anywhere, including an absolute path. There is no restriction on it.
- **The names stored inside the archive.** Whoever built the zip chose these. These are the restricted ones.

Before anything is written, the library works out where each entry would land and checks that it is inside the folder you chose. If it is not, extraction stops with an `UnsafePathError`. The check also covers a folder along the way that is a shortcut or symbolic link pointing outside. It always runs and cannot be switched off.

| Name inside the archive | Result |
| --- | --- |
| `docs/report.txt` | Written to `<target>/docs/report.txt` |
| `../../etc/passwd` | `UnsafePathError` |
| `/etc/passwd` | `UnsafePathError` |
| `C:\Windows\x.dll` | `UnsafePathError` |
| `a\b.txt` | `UnsafePathError`, for the `\` |
| `notes.txt:evil` | `UnsafePathError`, for the `:` |

[Section 7.1](#71-separator-and-normalization) gives the whole rule for names.

### 8.2. Extraction limits

A zip can be tiny and still expand to an enormous size. `extractAll` and `decompress` apply whichever limits you set while they work.

```ballerina
public type ExtractionLimits record {|
    int maxEntries?;
    int maxTotalSize?;
    int maxCompressionRatio?;
|};
```

| Limit | Meaning |
| --- | --- |
| `maxEntries` | How many entries may be extracted, counting directory entries, duplicates, and entries skipped under `SKIP` |
| `maxTotalSize` | Total bytes that may be written |
| `maxCompressionRatio` | How much larger any single entry may get |

**All three are off unless you set them.** A limit you do set must be positive; omission, not a value of zero, is what leaves one off. Extraction is safe by default about *where* files land, which [Section 8.1](#81-unsafe-entry-names) covers and cannot be switched off. It is not safe by default about *how much* is written.

Set all three when extracting something you do not trust. They catch different things: a ratio catches an archive built to expand, while `maxTotalSize` and `maxEntries` catch one that is simply enormous. Ten thousand uncompressed one-gigabyte entries have a ratio of about one and will fill your disk whatever ratio you set.

Limits are measured against bytes actually written, never the sizes the archive claims. A write that would take the total past `maxTotalSize` is refused before it happens. An entry's ratio is its uncompressed bytes divided by the compressed bytes actually taken from the archive to produce them, evaluated as the entry is read. An entry no compressed byte has been taken from has no ratio, and neither has a directory entry.

The limits bound what extraction does, not what opening the archive costs; see [Section 4.1](#41-opening). When a limit is passed, extraction stops with a `LimitExceededError` naming the entry, and files already written are left in place. `extractEntry` takes the same options, though only `maxCompressionRatio` can apply to one named entry.

## 9. Resource and memory characteristics

Archives are read from and written to disk directly. Content is held in memory in full only where you ask for it: `readEntry` into a `byte[]`, or `addEntry` given one, holds a whole entry, while the stream form of either holds one chunk. There is no ceiling on that choice.

One thing is always in memory: **the index of entries**, which the format keeps at the end of the file. `ArchiveReader` reads it on opening, and `ArchiveWriter` builds it up until `close` writes it out. Its size depends on the number of entries and the length of their names, not on their content.

Each reader and each writer holds one open file until closed, and **belongs to one strand**. Neither is an isolated class, so two strands cannot share one, and a service working with archives for many requests opens one per request. Every method on both is `isolated`, which says only that the method reaches no data beyond the object and its arguments; it does not make the object safe to share.

Several entry streams of one reader may be open at once, as [Section 4.3](#43-reading-entry-content) says. That is one strand holding several read positions.

## 10. Portability constraints

This library is designed so that the ZIP implementation underneath it can be replaced without changing this document. A feature is only included if every implementation this library targets can do it.

These are left out for that reason.

| Left out | What happens instead |
| --- | --- |
| Choosing a character set for names | UTF-8 only |
| Passing an archive as a stream or as a `byte[]` | An archive is always a file path |
| Compression methods beyond `STORE` and `DEFLATE`, such as Deflate64 and BZIP2 | Those entries give an `UnsupportedEntryError` |
| Zips split across several files | Not supported |
| Any setting for the Zip64 extension | Applied automatically when needed |
| Detailed access to the optional extra data on an entry | Only the fields of `Entry` are available |

**An archive is never a stream.** Streaming applies to **entry content** instead, in both directions. See [Section 4.3](#43-reading-entry-content) and [Section 5.2](#52-adding-entries).

## 11. Not supported in this version

These are outside the scope of this version.

**Changing an archive that already exists.** There is no way to add to, remove from, or rename an entry in an existing zip. Instead you read the old archive and write a new one, using `copyEntry` so nothing has to be recompressed.

**Passwords.** The library neither reads nor writes password-protected archives. A protected entry gives an `UnsupportedEntryError`.

**Archive comments**, for both reading and writing.

**Symbolic links.** They are skipped when creating an archive, and cannot be extracted when reading one. `Entry.isSymlink` tells you such an entry is present. Storing links as links is future work.

**Applying Unix permissions when extracting.** `Entry.unixMode` reports what the archive records; extraction does not apply it.

**Reaching a duplicate entry other than the first.** See [Section 7.3](#73-duplicate-names).

**Progress reporting** and cancelling a long-running job.

Settings are passed as records, so a later version can support these by adding optional fields to `CompressOptions` and `DecompressOptions`.
