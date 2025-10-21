# xpl-web-panels
This is javascript wrapper around [X-plane 12 Web API](https://developer.x-plane.com/article/x-plane-web-api/) which makes it super simple to use at web pages.

# Background
At some moment flight simmers try to have all controls available at single click/touch as in the real plane. Without changing view and looking for the knob at virtual cockpit. Of course the best option is to have hardware panels, but they are costly or difficult to build.

So this is often simulated by (touch)screen showing the panel and having click spots to control the knobs. There are many products available to achieve this - some paid, some free.

But with some little coding it's not difficult to create such panels from the scratch and have full control. Whether you create panel with the most realistic look as in the real plane or some "synthetic version" just for flight simulation making your more effective (e.g. switching views).

# Why wrapper?
X-plane web interface is pretty straightforward, but still you need some code around to get/set dataref value or call a command. You need to look-up it first by name and then use different http methods (and sometimes request bodies) to make the call. 

With this wrapper getting dataref's value is as easy as

```javascript
const xplApi = XplWebApi();
xplApi.getDataRefValue('sim/cockpit/autopilot/heading_mag')
  .then(value => console.log(value));
```

# Limitations
Currently (X-plane 12.2.0) there's a limitation in X-plane that API is not accessible over the network. You can use it only from localhost (the same computer where X-plane is running at).

But this can be solved. Also there are other reasons why it is a good idea to run a reverse proxy to have usable setup and be able to run panels (pages) from different devices in your network - e.g. tables. Details are described at [this page - TBI](PROXY.md).

Sample configuration file for nginx as reverse proxy is in [proxy/nginx.conf](proxy/nginx.conf).

# Documentation
You can interact with X-plane API using single javascript object. This is actually the wrapper. You first need to include its source - included in this repo
```html
<head>
    <script src="/xpl-web-api.js"></script>
</head>
```

And then you create the wrapper with script
```javascript
const xplApi = XplWebApi();
```

See examples in this repository for details, e.g. [hello world page](examples/hello-world/index.html).

## Reading dataref
To read dataref value once simply call `xplApi.getDataRefValue`. The method returns promise with the value.
```javascript
xplApi.getDataRefValue('sim/cockpit/autopilot/heading_mag')
  .then(value => console.log(value));
```
The value depends on dataref type - it can be simple value (e.g. heading) or array of multiple values (e.g throttle state for every motor). This is as per dataref documentation.

## Writing dataref
Similarly you can easily write dataref value
```javascript
xplApi.setDataRefValue('sim/cockpit/autopilot/heading_mag', value);
```
Again value can be simple value or array of multiple values. Note wrapper is not performing any validations - like checking if dataref is writable or if it support single or multiple values. It stays as simple as possible.

## Executing command
Command can be executed using
```javascript
xplApi.executeCommand('sim/operation/pause_toggle');
```
Note there's bug in X-plane not allowing to execute commands from browser. Read more details and how to solve it at [this page](PROXY.md). I logged the bug ticket to Laminar but was not addressed yet.

## Reading dataref continuously (subscribing to dataref)
```javascript
xplApi.subscribeDataRefs([
                'sim/graphics/view/pilots_head_x',
                'sim/graphics/view/pilots_head_y',
                'sim/graphics/view/pilots_head_z'
            ], (value) => {
              console.log('Received ', value);
            })
```            

## Setting more datarefs at once
```javascript
xplApi.setMultipleDataRefValues({
  "sim/graphics/view/pilots_head_x": -0.0451,
  "sim/graphics/view/pilots_head_y": 0.9732,
  "sim/graphics/view/pilots_head_z": -14.9206
});
```


## XPL API lookups
XPL API works with ids, not names (commands, datarefs). So the wrapper is doing id lookup when first executed for unknown name. Then the id is cached in the page scope so later it is used again until next page reload. After page reload/change the datarefs must be looked up again. So basically first call of dataref read/write can take little longer.
