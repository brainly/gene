# secure-serve

Serves a Next.js application with SSL enabled.

The executor sets up a Node.js proxy server with SSL enabled that redirects all requests to the Next.js application being served. The following tasks are performed by the executor:

1. Invokes the `serveTarget` option specified in the workspace configuration to serve the application.
2. Starts a Node.js proxy server with SSL enabled that redirects all requests to the application served in the previous step.

The hostname and ports of the application and the proxy server can be configured using the executor [options](#options).

## Usage

In the project configuration, add a `serve-base` target that serves the Next.js application and a `serve` target that uses the `secure-serve` executor and points to the `serve-base`. For example:

```json
{
  //...
  "projects": {
    "app1": {
      //...
      "targets": {
        "build": {
          // ...
        },
        "lint": {
          // ...
        },
        "copy-translations": [
          // ...
        ],
        "serve-base": {
          "dependsOn": [
            {
              "target": "copy-translations",
              "projects": "self"
            }
          ],
          "executor": "@nrwl/next:server",
          "options": {
            "buildTarget": "app1:build",
            "dev": true
          },
          "configurations": {
            "production": {
              "buildTarget": "app1:build:production",
              "dev": false
            }
          }
        },
        "serve": {
          "executor": "@brainly-gene/tools:secure-serve",
          "options": {
            "serveTarget": "app1:serve-base"
          },
          "configurations": {
            "production": {
              "serveTarget": "app1:serve-base:production"
            }
          }
        }
      }
    }
  }
}
```

With that configured, you can run the `serve` target to serve the application with SSL enabled:

```bash
yarn nx serve app1
```

Or:

```bash
yarn nx run app1:serve
```

## Options

### serveTarget (_**required**_)

Type: `string`

Target that serves the application.

### host (_**required**_)

Default: `localhost`

Type: `string`

Hostname of the proxy.

### port (_**required**_)

Default: `3000`

Type: `string`

Port of the proxy.

### targetHost (_**required**_)

Default: `localhost`

Type: `string`

Hostname of the target application.

### targetPort (_**required**_)

Default: `7200`

Type: `string`

Port of the target application.
