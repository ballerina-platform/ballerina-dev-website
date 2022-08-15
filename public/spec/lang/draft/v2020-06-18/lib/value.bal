// Copyright (c) 2019 WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
//
// WSO2 Inc. licenses this file to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file except
// in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

# The type of value to which `clone` and `cloneReadOnly` can be applied.
public type Cloneable readonly|xml|Cloneable[]|map<Cloneable>|table<map<Cloneable>>;

# A type parameter that is a subtype of `Cloneable`.
# Has the special semantic that when used in a declaration
# all uses in the declaration must refer to same type.
@typeParam
type CloneableType Cloneable;

# A type parameter that is a subtype of `anydata`.
# Has the special semantic that when used in a declaration
# all uses in the declaration must refer to same type.
@typeParam
type AnydataType anydata;


# Returns a clone of `v`.
# A clone is a deep copy that does not copy immutable subtrees.
# A clone can therefore safely be used concurrently with the original.
# It corresponds to the Clone(v) abstract operation,
# defined in the Ballerina Language Specification.
#
# + v - source value
# + return - clone of `v`
public function clone(CloneableType v) returns CloneableType = external;

# Returns a clone of `v` that is read-only, i.e. immutable.
# It corresponds to the ImmutableClone(v) abstract operation,
# defined in the Ballerina Language Specification.
#
# + v - source value
# + return - immutable clone of `v`
public function cloneReadOnly(CloneableType v) returns CloneableType = external;

# Constructs a value with a specified type by cloning another value.
# + v - the value to be cloned
# + t - the type for the cloned to be constructed
# + return - a new value that belongs to type `t`, or an error if this cannot be done
# 
# When `v` is a structural value, the inherent type of the value to be constructed
# comes from `t`. When `t` is a union, it must be possible to determine which
# member of the union to use for the inherent type by following the same rules
# that are used by list constructor expressions and mapping constructor expressions
# with the contextually expected type. If not, then an error is returned.
# The `constructFrom` operation is recursively applied to each member of `v` using
# the type descriptor that the inherent type requires for that member.
# 
# Like the Clone abstract operation, this does a deep copy, but differs in
# the following respects:
# - the inherent type of any structural values constructed comes from the specified
#   type descriptor rather than the value being constructed
# - the read-only bit of values and fields comes from the specified type descriptor
# - the graph structure of `v` is not preserved; the result will always be a tree;
#   an error will be returned if `v` has cycles
# - immutable structural values are copied rather being returned as is; all
#   structural values in the result will be mutable.
# - numeric values can be converted using the NumericConvert abstract operation
# - if a record type descriptor specifies default values, these will be used
#   to supply any missing members
public function cloneWithType(anydata v, typedesc<AnydataType> t) returns t|error = external;

# Tests whether `v` is read-only, i.e. immutable
# Returns true if read-only, false otherwise.
#
# + v - source value
# + return - true if read-only, false otherwise
public function isReadOnly(anydata v) returns boolean = external;

# Performs a minimal conversion of a value to a string.
# The conversion is minimal in particular in the sense
# that the conversion applied to a value that is already
# a string does nothing.
# + v - the value to be converted to a string
# + return - a string resulting from the conversion
# 
# The result of `toString(v)` is as follows:
#
# - if `v` is a string, then returns `v`
# - if `v` is `()`, then returns an empty string
# - if `v` is boolean, then the string `true` or `false`
# - if `v` is an int, then return `v` represented as a decimal string
# - if `v` is a float or decimal, then return `v` represented as a decimal string,
#   with a decimal point only if necessary, but without any suffix indicating the type of `v`;
#   return `NaN`, `Infinity` for positive infinity, and `-Infinity` for negative infinity
# - if `v` is a list, then returns the results of toString on each member of the list
#   separated by a space character
# - if `v` is a mapping, then returns key=value for each member separated by a space character
# - if `v` is xml, then returns `v` in XML format (as if it occurred within an XML element)
# - if `v` is table, then returns the results of toString on each member of the table
#    separate by a newline character
# - if `v` is an error, then a string consisting of the following in order
#     1. the string `error`
#     2. a space character
#     3. if the set of type-ids of the error is not empty
#         1. a space character
          2. a string representing the primary type-ids as described below
#     4. the message string
#     5. if the detail record is non-empty
#         1. a space character
#         2. the result of calling toString on the detail record
# - if `v` is an object, then
#     - if `v` provides a `toString` method with a string return type and no required parameters,
#       then the result of calling that method on `v`
#     - otherwise, a string consisting of the following in order
#         1. the string `object`
#         2. a space character
#	  3. if the set of type-ids of the object is not empty
#            1. a space character
#            2. a string representing the primary type-ids as described below
#	  4. a string representing the storage identity of the object in an
#	     implementation-dependent way
# - if `v` is a typedesc, then
#     1. the string `typedesc`
#     2. a space character
#     3. if the type descriptor is definite and the induced set of type-ids is not empty
#         1. a space character
#         2. a string representing the primary type-ids as described below
#     4. an implementation-dependent string
# - if `v` is any other behavioral type, then the identifier for the behavioral type
#   (`function`, `future`, `service` or `handle`)
#   followed by some implementation-dependent string
#
# The string describing a set of type-ids consists of strings describing each type-id
# separated by `&`. A string describing each primary type-id consists of a string of the
# form `{M}L` where M describes the module id and L describes the local id. M is of
# form `o/m` where o is the organization and m is the module name. If the local id is
# named, then L consists of the name; otherwise, L consists of `$` followed by an integer.
#
# Note that `toString` may produce the same string for two Ballerina values
# that are not equal (in the sense of the `==` operator).
public function toString((any|error) v) returns string = external;

// JSON conversion

# Converts a value of type `anydata` to `json`.
# This does a deep copy of `v` converting values that do
# not belong to json into values that do.
# A value of type `xml` is converted into a string as if
# by the `toString` function.
# A value of type `table` is converted into a list of
# mappings one for each row.
# The inherent type of arrays in the return value will be
# `json[]` and of mappings will be `map<json>`.
# A new copy is made of all structural values, including
# immutable values.
#
# + v - anydata value
# + return - representation of `v` as value of type json
# This panics if `v` has cycles.
public function toJson(anydata v) returns json = external;

# Returns the string that represents `v` in JSON format.
# `v` is first converted to `json` as if by the `toJson` function.
#
# + v - json value
# + return - string representation of `v`
public function toJsonString(anydata v) returns string = external;

# Parses a string in JSON format and returns the the value that it represents.
# All numbers in the JSON will be represented as float values.
# Returns an error if the string cannot be parsed.
#
# + str - string in JSON format
# + return - `str` parsed to json or error
public function fromJsonString(string str) returns json|error = external;

# Converts a value of type json to a user-specified type.
# This works the same as `cloneWithType`,
# except that it also does the inverse of the conversions done by `toJson`.
#
# + v - json value
# + t - type to convert to
# + return - value belonging to type `t` or error if this cannot be done
public function fromJsonWithType(json v, typedesc<anydata> t)
    returns t|error = external;

# Converts a string in JSON format to a user-specified type.
# This is a combination of `fromJsonString` followed by
# `fromJsonWithType`.
# + str - string in JSON format
# + t - type to convert to
# + return - value belonging to type `t` or error if this cannot be done
public function fromJsonStringWithType(string str, typedesc<anydata> t)
    returns t|error = external;
    
# Merges two json values.
#
# + j1 - json value
# + j2 - json value
# + return - the merge of `j1` with `j2` or an error if the merge fails
#
# The merge of `j1` with `j2` is defined as follows:
# - if `j1` is `()`, then the result is `j2`
# - if `j2` is `()`, then the result is `j1`
# - if `j1` is a mapping and `j2` is a mapping, then for each entry [k, j] in j2,
#   set `j1[k]` to the merge of `j1[k]` with `j`
#     - if `j1[k]` is undefined, then set `j1[k]` to `j`
#     - if any merge fails, then the merge of `j1` with `j2` fails
#     - otherwise, the result is `j1`.
# - otherwise, the merge fails
# If the merge fails, then `j1` is unchanged.
public function mergeJson(json j1, json j2) returns json|error = external;
