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

public function length(string str) returns int = external;

# Returns an iterator over the string
# The iterator will return the substrings of length 1 in order.
public function iterator(string str) returns abstract object {
    public next() returns record {| string value; |}?;
} = external;

# Concatenate all the `strs`. Empty string if empty.
public function concat(string... strs) return str;

public function getCodePoint(string str, int i) returns int = external;
public function substring(string str, int start, int end = str.length()) returns string = external;
// Lexicographically compare strings using their Unicode code points
// This will allow strings to be ordered in a consistent and well-defined way,
// but the ordering will not typically be consistent with cultural expectations
// for sorted order.
public function codePointCompare(string str1, string str2) returns int = external;

public function join(string separator, string... strs) returns string = external;

# Returns the index of the first occurrence of `substr` in the part of the `str` starting at `startIndex`
# or nil if it does not occur
public function indexOf(string str, string substr, int start = 0) returns int? = extern;
public function startsWith(string str, string substr) returns boolean = extern;
public function endsWith(string str, string substr) returns boolean = extern;

// Standard lib (not lang lib) should have a Unicode module (or set of modules)
// to deal with Unicode properly. These will need to be updated as each
// new Unicode version is released.
# Return A-Z into a-z and leave other characters unchanged
public function toLowerAscii(string str) returns string = extern;
# Return a-z into A-Z and leave other characters unchanged
public function toUpperAscii(string str) returns string = extern;
# Remove ASCII white space characters (0x9...0xD, 0x20) from start and end of `str`
public function trim(string str) returns string = extern;

# Represents `str` as an array of bytes using UTF-8
public function toBytes(string str) returns byte[] = extern;
# Convert back to a string from its UTF-8 representation in `bytes`.
public function fromBytes(byte[] bytes) returns string|error = extern;

# Returns an array with an int for each code point in `str`.
public function toCodePointInts(string str) returns int[] = extern;
# Creates a string from an array of ints representing its code points.
# Returns an error if any member of `codePoints` is negative or greater than 0x10FFFF
# or is a surrogate (i.e. in the range 0xD800 or 0xDFFF inclusive).
public function fromCodePointInts(int[] codePoints) returns string|error = extern;

