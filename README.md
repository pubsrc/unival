# Unival

Sanitize key-value or string files for consistency by detecting duplicate keys, values, or lines on the fly within a file or across a group of files.
You can validate a file for duplicate keys, values, both keys and values or duplicate lines


# Installation
Run ``` npm install unival ``` to install unival

To install globally
Run ``` npm install unival -g ``` to install unival


# Usage

To run unival from command line, simple run the ``` unival ``` command.

## Command line options

* ``` init ``` with this command unival creates a sample config file (`` unival.json ``) at current directory 

* ``` file ``` with this option unival runs in file mode and only validates individual files for duplicates.
Example ``` unival file ```
* ``` group ``` with this option unival runs in group mode and only validates the file groups (if provided) for duplicates.
Example ``` unival group ```
If none of the options is provided unival runs in dual mode. First in file mode to validate individual files and then in group mode to validate file groups for duplicates.
* ``` silent ``` by default, unival will through an error if duplicates are found. When silent option is provided unival does not through any error but silently prints the error messages on console.
Example ``` unival silent ```
* ``` --config ``` by default, unival looks for the config file (unival.json) at root directory. To specify a different location for the config file use ``` --config ``` option.
Example ``` unival --config=configurations/unival.json```

# Documentation

Unival is a configurable extension. You can customize the default configurations adding a unival.json file at the root directory. 

A sample unival.json file is shown below

```
{
  "target": [
    ".properties"
  ],
  "src": [],
  "delimiter": "=",
  "testBy": "keyvalue",
  "groups": [],
  "encoding": "utf-8",
  "skipLinePrefix": [
    "#"
  ],
  "whitelist": [],
  "caseSensitive": false
}
```

The contents of this file are explained below under documentation.

## target
Here you can specify all files extensions in an array which you want to be validated by unival.  
For example, to allow unival to validated ``` .properties ``` and ``` .txt ``` files, you can specify them in target array ash shown below.
```
"target": [
    ".properties",
    ".txt"
  ]
```
To validate all files set target to ``` .* ```.

## src
This is an array of files or directories that unival will validate.
```
"src": [
  "Test/",
  "messages.properties"
  ]

```

## delimiter
To validate keys, values, or both key and value for duplicates, here you can specify the delimiter.
For example, if you key values are delimited by an = symbol, like:
greet_guest =  Welcome Guest
You need to specify the delimiter as below:
```
"delimiter": "="
```
## testBy
Here you can specify, if the validation for duplicates is based on key, value, both, or entire line
For example to find only duplicate values in a file, you can set testBy to key as shown below
```
  "testBy": "value",
```
Other possible values for testBy are as follows:
``` key ``` finds duplicate keys in a file
``` keyvalue``` finds duplicate keys or values in a file
``` line ``` finds duplicate lines in a file

## groups
This property is used to group two or more files and validate them for duplicates. That means unival will validate a file for duplication if no duplicates were found it will then try to find the duplicates across all files within the same group.
For example, assuming the testBy value it set to “value” and we have two files within the same group as shown below:
 File 1
make_payment = Make payment

File 2
pay = Make payment
unival will consider Make payment as duplicate because this is same value in two files within the same group.

The groups property is an array of arrays. Each array inside the group array is list of files to be grouped together.
For example
To group file1.txt and  file2.txt within the same group, you can specify this as shown below:

``` 
"groups": [["file.txt", "file.txt"] ] 
```
To group all files in directory g1 in one group and all files in directory g2 in another group, you can set groups as shown below:

```
"groups": [["g1/", "g2/"] ] 
```
Any files within the subdirectories of g1 will be considered in same group as g1

## encoding
Here you can specify the encoding of your target files. The default value is  utf-8

```
"encoding": "utf-8" 
```

## Skip lines
You probably are going to have comments in your files or you might want to ignoring files beginning with certain strings and to do so, you can use ``` skipLinePrefix ``` 
For example to skip validation of a line that start with a ``` # ``` or ``` // ```, you can set the ``` skipLinePrefix ``` property as shown below:
``` 
"skipLinePrefix": [
    "#",
    "//"
  ]
```

## whitelist
To whitelist a set of keys or values (value or line) so that they are considered as duplicate, simply add them to whitelist.
A whitelist is an array of WhiteListItem which is explained below:
```
{
  "src": [
    "common.properties",
    "directory/"
  ],
  "keySet": [
    "make_payment"
  ],
  "valueSet": [
    "Make payment"
  ]
}
```
``` src ``` is an array of distinct directories or files in which we want to whitelist keys or values or lines.
``` keySet ``` is an array of distinct keys we want to whitelist.
``` keySet ``` is an array of distinct values or lines we want to whitelist.


## Case sensitivity
Unival by default compares strings ignoring the case. To make unival to make case-sensitive comparisons while finding duplicates, simply set ```  caseSensitive ``` property to ``` true ``` as below.

```
"caseSensitive": true
```

## License

Copyright (c) 2020-2020. Licensed under the Apache License 2.0.