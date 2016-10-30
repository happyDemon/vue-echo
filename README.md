# vue-echo
Vue integration for the Laravel Echo library.

## Install

  ``` bash
  npm install vue-echo --save
  ```
  
## Usage

### Initialise
First you'll need to register the plugin and optionally initialise the Echo instance.

``` js
import VueEcho from 'vue-echo';
  
Vue.use(VueEcho, {
    broadcaster: 'pusher',
    key: 'PUSHER KEY',
});

/**
 * Alternatively you can pass an echo instance:
 * ********************************************
 * import Echo from 'laravel-echo';
 * 
 * let EchoInstance = new Echo({
 *     broadcaster: 'pusher',  
 *     key: 'PUSHER KEY',
 * });
 * Vue.use(VueEcho, EchoInstance);
 */
  ```

### Using Echo
Once vue-echo is registered, every vue instance is able to to subscribe to channels and listen to events through the `this.$echo` property on the connection you specified earlier.


### Subscribe your Vue instance to a single channel
You can subscribe a vue instance to a single standard channel if needed and define your events.

```js
var vm = new Vue({
    channel: 'blog'
    echo: {
      'BlogPostCreated': payload => {
        console.log('blog post created', payload);
      },
      'BlogPostDeleted': payload => {
        console.log('blog post deleted', payload);
      }
    }
  })
```

#### Subscribing to channels

Laravel echo allows you to subscribe to; normal, private and presence channels.

In the example above we subscribed to a standard channel.

##### Private channel
If you would like to subscribe to private channel instead, prefix your channel name with `private`:

```js
var vm = new Vue({
    channel: 'private:team.1'
    echo: {
      'BlogPostCreated': payload => {
        console.log('blog post created', payload);
      },
      'BlogPostDeleted': payload => {
        console.log('blog post deleted', payload);
      }
    }
  })
```

##### Presence channel

If you would like to subscribe to presence channel instead, prefix your channel name with `presence`:

```js
var vm = new Vue({
    channel: 'presence:team.1.chat'
    echo: {
      'NewMessage': payload => {
        console.log('bNew message from team', payload);
      }
    }
  })
```