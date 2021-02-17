var searchData = {
  "modules": [
    {
      "id": "file",
      "description": "",
      "orgName": "ballerina",
      "version": "0.7.0-alpha3"
    }
  ],
  "classes": [],
  "functions": [
    {
      "id": "basename",
      "description": "Retrieves the base name of the file from the provided location,\nwhich is the last element of the path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "copy",
      "description": "Copy the file/directory in the old path to the new path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "create",
      "description": "Creates a file in the specified file path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "createDir",
      "description": "Creates a new directory with the specified name.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "createTemp",
      "description": "Creates a temporary file.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "createTempDir",
      "description": "Creates a temporary directory.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "getAbsolutePath",
      "description": "Retrieves the absolute path from the provided location.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "getCurrentDir",
      "description": "Returns the current working directory.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "getMetaData",
      "description": "Returns the metadata information of the file specified in the file path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "isAbsolutePath",
      "description": "Reports whether the path is absolute.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "joinPath",
      "description": "Joins any number of path elements into a single path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "normalizePath",
      "description": "Normalizes a path value.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "parentPath",
      "description": "Returns the enclosing parent directory.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "readDir",
      "description": "Reads the directory and returns a list of metadata of files and directories\ninside the specified directory.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "relativePath",
      "description": "Returns a relative path, which is logically equivalent to the target path when joined to the base path with an\nintervening separator.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "remove",
      "description": "Removes the specified file or directory.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "rename",
      "description": "Renames(Moves) the old path with the new path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "splitPath",
      "description": "Splits a list of paths joined by the OS-specific path separator.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "test",
      "description": "Tests a file path against a test condition .",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    }
  ],
  "records": [
    {
      "id": "FileEvent",
      "description": "Represents an event which will trigger when there is a changes to listining direcotry.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "ListenerConfig",
      "description": "Represents configurations that required for directory listener.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "MetaData",
      "description": "Metadata record contains metadata information of a file.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    }
  ],
  "constants": [],
  "errors": [
    {
      "id": "Error",
      "description": "Represents file system related errors.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "FileNotFoundError",
      "description": "Represents an error that occurs when the file/directory does not exist at the given filepath.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "FileSystemError",
      "description": "Represents an error that occurs when a file system operation fails.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "GenericError",
      "description": "Represents generic error for filepath\n",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "InvalidOperationError",
      "description": "Represents an error that occurs when a file system operation is denied due to invalidity.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "InvalidPathError",
      "description": "Represents error occur when the given file path is invalid.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "InvalidPatternError",
      "description": "Represent error occur when the given pattern is not a valid filepath pattern.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "IOError",
      "description": "Represents IO error occur when trying to access the file at the given filepath.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "NotLinkError",
      "description": "Represents error occur when the file at the given filepath is not a symbolic link.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "PermissionError",
      "description": "Represents an error that occurs when a file system operation is denied, due to the absence of file permission.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "RelativePathError",
      "description": "Represents an error that occurs when the given target filepath cannot be derived relative to the base filepath.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "SecurityError",
      "description": "Represents security error occur when trying to access the file at the given filepath.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "UNCPathError",
      "description": "Represents error occur in the UNC path.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    }
  ],
  "types": [],
  "clients": [],
  "listeners": [
    {
      "id": "Listener",
      "description": "Represents the directory listener endpoint, which is used to listen to a directory in the local file system.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    }
  ],
  "annotations": [],
  "abstractObjects": [],
  "enums": [
    {
      "id": "CopyOption",
      "description": "Represents options that can be used when copying files/directories\n\n",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "DirOption",
      "description": "Represents options that can be used when creating or removing directories.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "NormOption",
      "description": "Represents the options that can be passed to normalizePath function.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    },
    {
      "id": "TestOption",
      "description": "Represents the options that can be passed to test function.",
      "moduleId": "file",
      "moduleOrgName": "ballerina",
      "moduleVersion": "0.7.0-alpha3"
    }
  ]
};