---
lang: shell
---
```
$ bal build
ERROR [service.bal:(45:39,49:10)] using the experimental 'natural expression' feature,
use the '--experimental' option to enable experimental features
error: compilation contains errors

$ bal build --experimental
Generating executable
	target/bin/return_triage.jar

# Requires Ballerina 2201.13.0 (Swan Lake Update 13) or later.
# Pass --experimental to bal build, bal run, and bal test.
# In VS Code, enable experimental features in the Ballerina extension settings.
```
