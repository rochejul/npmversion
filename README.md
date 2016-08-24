# npmversion

[![Build Status](https://travis-ci.org/rochejul/npmversion.svg?branch=master)](https://travis-ci.org/rochejul/npmversion)[![Dependency Status](https://david-dm.org/rochejul/npmversion.svg)](https://david-dm.org/rochejul/npmversion)
[![devDependency Status](https://david-dm.org/rochejul/npmversion/dev-status.svg)](https://david-dm.org/rochejul/npmversion#info=devDependencies)

[![Known Vulnerabilities](https://snyk.io/test/github/rochejul/npmversion/badge.svg)](https://snyk.io/test/github/rochejul/npmversion)

[![NPM](https://nodei.co/npm/npmversion.png?downloads=true&downloadRank=true)](https://nodei.co/npm/npmversion/)
[![NPM](https://nodei.co/npm-dl/npmversion.png?&months=6&height=3)](https://nodei.co/npm/npmversion/)

A command line node module to deal with "bumping" and "npm version"

The "version" command will:
 - change the package version of the package.json file and in the npm-shrinkwrap.json file if this one exists
 - deal with the prenumber and the preid flag
 - create git commits and tags
 - push the git commits and tags
 
 
## Possible options

    --help
        Print the help around the command

    -i --increment [<level>]
        Increment a version by the specified level.  Level can
        be one of: major, minor, patch, premajor, preminor,
        prepatch, or prerelease.  Default level is 'patch'.
        Only one version may be specified. A Git commit and
        tag will be created.
        Nota Bene: it will use the "npm version" command if the option
        "read-only" is not activated.

        -p --preid <identifier>
            Identifier to be used to prefix premajor, preminor,
            prepatch or prerelease version increments. It could
            be 'snapshot', 'beta' or 'alpha' for example.
    
        --force-preid
            If specified, we force to add if needed the specified preid
            
        --read-only
                Print only the future version. Don't modify the package.json file,
                nor the npm-shrinkwrap.json file, don't create a commit and don't
                create a git tag
        
        --nogit-commit
            No git commit
    
        --nogit-tag
            No git tag
    
        --git-push
            Push the commit and the tags if needed

    -u  --unpreid
        Remove the prefix. The increment and preid option will be ignored.
        Only a Git commit will be created

        --read-only
               Print only the future version. Don't modify the package.json file,
               nor the npm-shrinkwrap.json file, don't create a commit and don't
               create a git tag
       
       --nogit-commit
           No git commit
   
       --nogit-tag
           No git tag
   
       --git-push
           Push the commit and the tags if needed

## How to import it ?

Type the command "npm install --save-dev --save-exact npmversion

````json
{
  "name": "my-app",
  "version": "1.2.0",
  "deveDependencies": {
      "npmversion": "latest"
  }
}
````

## Possible NPM-RUN configuration

````json
{
  "name": "my-app",
  "version": "0.0.1",
  "scripts": {
      "test": "node ./node_modules/mocha/bin/mocha --recursive --ui bdd --colors ./test",
      
      "bump-release": "test && npmversion --unpreid --git-push",
  
      "bump-major": "test && npmversion --increment major --git-push",
      "bump-minor": "test && npmversion --increment minor --git-push",
      "bump-patch": "test && npmversion --increment patch --git-push",
      
      "bump-major-beta": "npmversion --increment major --preid beta --nogit-tag --git-push",
      "bump-minor-beta": "npmversion --increment minor --preid beta --nogit-tag --git-push",
      "bump-patch-beta": "npmversion --increment patch --preid beta --nogit-tag --git-push"
  }
}
````

## Pre and Post NPM-RUN

As other base npm commands, you can have now a pre and a post npmversion command. The post command
is called before create a git commit / tag and pushing.


````json
{
  "name": "my-app",
  "version": "0.0.1",
  "scripts": {
      "test": "node ./node_modules/mocha/bin/mocha --recursive --ui bdd --colors ./test",
      
      "bump-release": "test && npmversion --unpreid --git-push",
  
      "bump-major": "test && npmversion --increment major --git-push",
      "bump-minor": "test && npmversion --increment minor --git-push",
      "bump-patch": "test && npmversion --increment major --git-push",
      
      "bump-major-beta": "npmversion --increment major --preid beta --nogit-tag --git-push",
      "bump-minor-beta": "npmversion --increment minor --preid beta --nogit-tag --git-push",
      "bump-patch-beta": "npmversion --increment major --preid beta --nogit-tag --git-push",
      
      "prenpmversion": "echo \"Pre npmversion\"",
      "postnpmversion": "echo \"Post npmversion\""
  }
}
````

## Possible .npmversionrc configuration

````json
{
    "force-preid": false,
    "nogit-commit": false,
    "nogit-tag": true,
    "git-push": false,
    "git-commit-message": "Release version: %s",
    "git-tag-message": "v%s",
    "increment": "minor"
}
````

## Possible outputs

### In a classical way

````
> semver 1.2.3 --increment patch                             1.2.4
> semver 1.2.3 --increment minor                             1.3.0
> semver 1.2.3 --increment major                             2.0.0
> semver 1.2.3 --increment prerelease                        1.2.4-0
> semver 1.2.3 --increment prepatch                          1.2.4-0
> semver 1.2.3 --increment preminor                          1.3.0-0
> semver 1.2.3 --increment premajor                          2.0.0-0

> semver 1.2.3-0 --increment patch                           1.2.3
> semver 1.2.3-0 --increment minor                           1.3.0
> semver 1.2.3-0 --increment major                           2.0.0
> semver 1.2.3-0 --increment prerelease                      1.2.3-1
> semver 1.2.3-0 --increment prepatch                        1.2.4-0
> semver 1.2.3-0 --increment preminor                        1.3.0-0
> semver 1.2.3-0 --increment premajor                        2.0.0-0

> semver 1.2.3-beta --increment patch                        1.2.4
> semver 1.2.3-beta --increment minor                        1.3.0
> semver 1.2.3-beta --increment major                        2.0.0
> semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
> semver 1.2.3-beta --increment prepatch                     1.2.4-0
> semver 1.2.3-beta --increment preminor                     1.3.0-0
> semver 1.2.3-beta --increment premajor                     2.0.0-0

> semver 1.2.3-beta.0 --increment patch                      1.2.4
> semver 1.2.3-beta.0 --increment minor                      1.3.0
> semver 1.2.3-beta.0 --increment major                      2.0.0
> semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
> semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
> semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
> semver 1.2.3-beta.0 --increment premajor                   2.0.0-0

> semver 1.2.3 --preid beta --increment patch                 1.2.4
> semver 1.2.3 --preid beta --increment minor                 1.3.0
> semver 1.2.3 --preid beta --increment major                 2.0.0
> semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
> semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
> semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
> semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0

> semver 1.2.3-0 --preid beta --increment patch               1.2.4
> semver 1.2.3-0 --preid beta --increment minor               1.3.0
> semver 1.2.3-0 --preid beta --increment major               2.0.0
> semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
> semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
> semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
> semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0

> semver 1.2.3-beta --preid beta --increment patch            1.2.4
> semver 1.2.3-beta --preid beta --increment minor            1.3.0
> semver 1.2.3-beta --preid beta --increment major            2.0.0
> semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
> semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
> semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
> semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0

> semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4
> semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0
> semver 1.2.3-beta.0 --preid beta --increment major          2.0.0
> semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
> semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
> semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
> semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0

### With the force-preid option

> semver 1.2.3 --increment patch                             1.2.4
> semver 1.2.3 --increment minor                             1.3.0
> semver 1.2.3 --increment major                             2.0.0
> semver 1.2.3 --increment prerelease                        1.2.4-0
> semver 1.2.3 --increment prepatch                          1.2.4-0
> semver 1.2.3 --increment preminor                          1.3.0-0
> semver 1.2.3 --increment premajor                          2.0.0-0

> semver 1.2.3-0 --increment patch                           1.2.3
> semver 1.2.3-0 --increment minor                           1.3.0
> semver 1.2.3-0 --increment major                           2.0.0
> semver 1.2.3-0 --increment prerelease                      1.2.3-1
> semver 1.2.3-0 --increment prepatch                        1.2.4-0
> semver 1.2.3-0 --increment preminor                        1.3.0-0
> semver 1.2.3-0 --increment premajor                        2.0.0-0

> semver 1.2.3-beta --increment patch                        1.2.4
> semver 1.2.3-beta --increment minor                        1.3.0
> semver 1.2.3-beta --increment major                        2.0.0
> semver 1.2.3-beta --increment prerelease                   1.2.3-beta.0
> semver 1.2.3-beta --increment prepatch                     1.2.4-0
> semver 1.2.3-beta --increment preminor                     1.3.0-0
> semver 1.2.3-beta --increment premajor                     2.0.0-0

> semver 1.2.3-beta.0 --increment patch                      1.2.4
> semver 1.2.3-beta.0 --increment minor                      1.3.0
> semver 1.2.3-beta.0 --increment major                      2.0.0
> semver 1.2.3-beta.0 --increment prerelease                 1.2.3-beta.1
> semver 1.2.3-beta.0 --increment prepatch                   1.2.4-0
> semver 1.2.3-beta.0 --increment preminor                   1.3.0-0
> semver 1.2.3-beta.0 --increment premajor                   2.0.0-0

> semver 1.2.3 --preid beta --increment patch                 1.2.4-beta
> semver 1.2.3 --preid beta --increment minor                 1.3.0-beta
> semver 1.2.3 --preid beta --increment major                 2.0.0-beta
> semver 1.2.3 --preid beta --increment prerelease            1.2.4-beta.0
> semver 1.2.3 --preid beta --increment prepatch              1.2.4-beta.0
> semver 1.2.3 --preid beta --increment preminor              1.3.0-beta.0
> semver 1.2.3 --preid beta --increment premajor              2.0.0-beta.0

> semver 1.2.3-0 --preid beta --increment patch               1.2.3-beta
> semver 1.2.3-0 --preid beta --increment minor               1.3.0-beta
> semver 1.2.3-0 --preid beta --increment major               2.0.0-beta
> semver 1.2.3-0 --preid beta --increment prerelease          1.2.3-beta.0
> semver 1.2.3-0 --preid beta --increment prepatch            1.2.4-beta.0
> semver 1.2.3-0 --preid beta --increment preminor            1.3.0-beta.0
> semver 1.2.3-0 --preid beta --increment premajor            2.0.0-beta.0

> semver 1.2.3-beta --preid beta --increment patch            1.2.4-beta
> semver 1.2.3-beta --preid beta --increment minor            1.3.0-beta
> semver 1.2.3-beta --preid beta --increment major            2.0.0-beta
> semver 1.2.3-beta --preid beta --increment prerelease       1.2.3-beta.0
> semver 1.2.3-beta --preid beta --increment prepatch         1.2.4-beta.0
> semver 1.2.3-beta --preid beta --increment preminor         1.3.0-beta.0
> semver 1.2.3-beta --preid beta --increment premajor         2.0.0-beta.0

> semver 1.2.3-beta.0 --preid beta --increment patch          1.2.4-beta
> semver 1.2.3-beta.0 --preid beta --increment minor          1.3.0-beta
> semver 1.2.3-beta.0 --preid beta --increment major          2.0.0-beta
> semver 1.2.3-beta.0 --preid beta --increment prerelease     1.2.3-beta.1
> semver 1.2.3-beta.0 --preid beta --increment prepatch       1.2.4-beta.0
> semver 1.2.3-beta.0 --preid beta --increment preminor       1.3.0-beta.0
> semver 1.2.3-beta.0 --preid beta --increment premajor       2.0.0-beta.0
````
