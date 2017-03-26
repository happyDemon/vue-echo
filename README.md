# vue-echo
Vue 2 integration for the Laravel Echo library.

This Vue plugin injects a Laravel Echo instance into all of your vue instances, allowing for a simple channel subscription on each instance, or using Laravel Echo through `this.$echo`.

## Install

``` bash
npm install vue-echo --save
```
  
## Usage

### Initialize
First you'll need to register the plugin and, optionally, initialize the Echo instance.

``` js
import VueEcho from 'vue-echo';
  
Vue.use(VueEcho, {
    broadcaster: 'pusher',
    key: 'PUSHER KEY'
});

/**
 * Alternatively you can pass an echo instance:
 * ********************************************
 * import Echo from 'laravel-echo';
 * 
 * const EchoInstance = new Echo({
 *     broadcaster: 'pusher',  
 *     key: 'PUSHER KEY'
 * });
 * Vue.use(VueEcho, EchoInstance);
 */
```

### Using Echo
Once vue-echo is registered, every vue instance is able to subscribe to channels and listen to events through the `this.$echo` property on the connection you specified earlier.

```js
var vm = new Vue({
    mounted() {
        // Listen for the 'NewBlogPost' event in the 'team.1' private channel
        this.$echo.private('team.1').listen('NewBlogPost', (payload) => {
            console.log(payload);
        });
    }
});
```

### Subscribe your Vue instance to a single channel
You can subscribe a vue instance to a single standard channel if needed and define your events.

```js
var vm = new Vue({
    channel: 'blog',
    echo: {
        'BlogPostCreated': (payload, vm) => {
            console.log('blog post created', payload);
        },
        'BlogPostDeleted': (payload, vm) => {
            console.log('blog post deleted', payload);
        }
    }
});
```

Since the scope of `this` would be the same as the scope where you declare your Vue instance a second parameter is added to these locally registered events. This parameter is a direct reference to your Vue instance, you can make any changes you need through there.

#### Subscribing to channels

Laravel Echo allows you to subscribe to: normal, private and presence channels.

In the example above, we subscribed to a standard channel.

##### Private channel
If you would like to subscribe to a private channel instead, prefix your channel name with `private:`

```js
var vm = new Vue({
    channel: 'private:team.1',
    echo: {
        'BlogPostCreated': (payload, vm) => {
            console.log('blog post created', payload);
        },
        'BlogPostDeleted': (payload, vm) => {
            console.log('blog post deleted', payload);
        }
    }
});
```

##### Presence channel

If you would like to subscribe to presence channel instead, prefix your channel name with `presence:`

```js
var vm = new Vue({
    channel: 'presence:team.1.chat',
    echo: {
        'NewMessage': (payload, vm) => {
            console.log('new message from team', payload);
        }
    }
});
```

### Manually listening to events

If there's a scenario where you want to listen to events after certain conditions are met, you can do so through `this.channel`:

```js
var vm = new Vue({
    channel: 'private:team.1',
    echo: {
        'BlogPostCreated': (payload, vm) => {
            console.log('blog post created', payload);
        },
        'BlogPostDeleted': (payload, vm) => {
            console.log('blog post deleted', payload);
        }
    },
    mounted(){
        if(window.user.role == 'admin'){
            this.channel.listen('BlogPostEdited', (payload) => {
                console.log('As admin I get notified of edits', payload);
            });
        }
    }
});
```
