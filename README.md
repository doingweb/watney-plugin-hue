Watney Hue Plugin
=================

[![Build Status](https://travis-ci.org/doingweb/watney-plugin-hue.svg?branch=master)](https://travis-ci.org/doingweb/watney-plugin-hue)
[![Greenkeeper badge](https://badges.greenkeeper.io/doingweb/watney-plugin-hue.svg)](https://greenkeeper.io/)

A Watney plugin for the Philips Hue lighting system.

Currently only for plain white bulbs, because that's all I have :)

**Note**: Experimental API. May go though some pretty wild changes before 1.x, as we figure out which ideas are good and which are really really bad.

Getting Started
---------------

To configure the plugin, you'll need to 1) find your bridge, 2) register a user, and 3) save the bridge `host` and `username` in your Watney config.

### Find Your Bridge

If you have no `hue` configuration set up in your Watney config yet, the CLI will present just one option: "Register a new bridge user for Watney", which will first offer to find your bridge:

```console
$ npm run cli
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
? Run command-line interface for plugin hue
? What would you like to do? Register a new bridge user for Watney
? How shall we find your bridge? (Use arrow keys)
> Automatically (via N-UPnP)
  Manually enter a hostname or IP address
```

If you already know your bridge's hostname or IP address, you can manually enter it. The automatic choice uses N-UPnP, which uses a [meethue.com API endpoint](https://www.meethue.com/api/nupnp) to discover the local IP address of the bridge associated with the public IP address where the request originates. This requires setting up an account at meethue.com and associating your bridge(s) in advance.

### Register a User

Once you've found the bridge, you can initiate user registration. The user description is how you'll be able to tell what the user you're about to make is even for, so be descriptive:

```console
$ npm run cli
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
? Run command-line interface for plugin hue
? What would you like to do? Register a new bridge user for Watney
? How shall we find your bridge? Automatically (via N-UPnP)
Found bridge "Philips Hue" at 192.168.1.123.
? Please provide a brief description for this new user. This will be saved in your bridge. Watney Hue Plugin
Now go ahead and press the link button on the thing...
```

At this point, you can run over to the physical Hue bridge and press the link button!

```console
$ npm run cli
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
? Run command-line interface for plugin hue
? What would you like to do? Register a new bridge user for Watney
? How shall we find your bridge? Automatically (via N-UPnP)
Found bridge "Philips Hue" at 192.168.1.123.
? Please provide a brief description for this new user. This will be saved in your bridge. Watney Hue Plugin
Now go ahead and press the link button on the thing...
[link button not pressed] Retrying 5 more times...
[link button not pressed] Retrying 4 more times...
Success! Now save these values in your Watney config:
host: 192.168.1.123
username: CR5BmQhfVvjagFJUwdAr43sRZ1BMluHSL6tJLAt5
? Return to plugins menu? No
$
```

And you've created a user! Copy those values into your Watney config file to make this thing fully operational:

```yaml
hue:
  host: 192.168.1.123
  username: CR5BmQhfVvjagFJUwdAr43sRZ1BMluHSL6tJLAt5
```

Usage
-----

Once the plugin has been configured, you can retrieve `Light` or `LightGroup` objects and manipulate them programatically (the names can be found from the Hue app or [with the CLI](#print-out-all-of-the-lights-and-light-groups)):

```js
let hue = app.plugins.get('hue');

let [porchLight, bedroomLight] = await hue.getLights('Porch', 'Bedroom');
let [livingRoomLights, kitchenLights] = await hue.getLightGroups('Living Room', 'Kitchen');

// Let's get ready to show a movie!
await Promise.all([
  porchLight.turnOn(0.5), // Half brightness
  bedroomLight.turnOff(), // Nobody's in there
  kitchenLights.turnOn(0.1), // Keep them on, but very low
  livingRoomLights.turnOff(5) // 5-second transition
]);
```

Events
------

It might be important to a script to know when light state is changed by other scripts. For instance, imagine a script that temporarily brings a light up to full, then back down to its previous brightness after some period of time. If another script caused the light to turn off, the first script probably wouldn't want to turn the light back on just to restore its state since its desired state is now off.

The emitter and event symbols can be found in the `events` object:

```js
let hue = app.plugins.get('hue');

const { LIGHT_STATE_CHANGE_SUCCESS } = hue.events;

let [hallwayLight] = await hue.getLights('Hallway');

hallwayLight.on(LIGHT_STATE_CHANGE_SUCCESS, state =>
  console.log('The hallway light state changed!')
);
```

CLI
---

Once you've configured the plugin, you get new CLI functions:

```console
$ npm run cli
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
? Run command-line interface for plugin hue
? What would you like to do?
> Print out all of the lights and light groups
  Manage users
```

### Print out all of the lights and light groups

Use this command to get a list of all of the light and light group names.

```console
[watney-app] It's good to be home.
[hue] Plugin has been constructed.
? Run command-line interface for plugin hue
? What would you like to do? Print out all of the lights and light groups
[hue] Plugin initialized.
Lights [
  "Patio 1",
  "Patio 2",
  "Porch",
  "Bedroom",
  "Kitchen 1",
  "Kitchen 2",
  "Living Room 1",
  "Living Room 2",
  "Living Room 3",
  "Hallway"
]
Groups [
  "Lightset 0",
  "Bedroom",
  "Living Room",
  "Kitchen",
  "Patio",
  "Porch"
]
? Return to plugins menu? No
$
```

### Manage users

View and delete bridge users (including extra ones you may have accidentally [made earlier](#register-a-user)) to keep things neat and tidy.

TODO
----

* Refine the API around brightness and transition time.
* Color bulbs?
