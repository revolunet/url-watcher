# url-watcher

Simple CLI to monitor website downtime. used for measuring "zero downtime deployments".

## Usage

By default it makes a request every `100ms` with a `500ms` request timeout. Hit `Ctrl + c` to stop watching.

```
npx url-watcher http://www.voila.fr
```
