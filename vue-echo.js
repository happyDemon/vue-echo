import Echo from 'laravel-echo';

export default {
    install(Vue, options) {
        if (!options) {
            throw new Error("[Vue-Echo] cannot locate options");
        }

        if (typeof options !== 'object') {
            throw new Error("[Vue-Echo] cannot initiate options");
        }

        if(typeof options.socketId == 'function')
        {
            Vue.prototype.$echo = options;
        }
        else
        {
            Vue.prototype.$echo = new Echo(options);
        }

        Vue.mixin({
            mounted() {
                let channel = this.$options['channel'];
                const events = this.$options['echo'];

                // Exit function if channel is undefined or null.
                if(channel == undefined)
                {
                    return
                } 
                
                // if channel is a function, evaluate the channel by running the provided callback function.
                if(typeof channel === 'function')
                {
                    channel = channel(this)
                }
                
                // After we evaluated potential callback, break if provided channel is not a string
                if(typeof channel !== 'string')
                {
                    throw new Error("[Vue-Echo] channel needs to be of type string");
                }
                
                // Join correct channel
                if(channel.startsWith('private:'))
                {
                    this.channel = this.$echo.private(channel.replace('private:', ''))
                }
                else if(channel.startsWith('presence:'))
                {
                    this.channel = this.$echo.join(channel.replace('presence:', ''))
                }
                else
                {
                    this.channel = this.$echo.channel(channel);
                }

                
                // Add user-provided event listeners for the socket
                if(events)
                {
                    Object.keys(events).forEach(key => {
                        // Bind the VM as second parameter
                        this.channel.listen(key, (payload) => events[key](payload, this));
                    }, this);
                }

                /* Cleanup: Leave the channel on destroyed vue instance.
                 * - Use an programmatic listener instead of the normal "beforeDestroy". This way, we do not have to do validation of the variable "channel" twice. 
                 */
                this.$once('hook:beforeDestroy', () => {
                    if(channel.startsWith('private:'))
                    {
                        channel = channel.replace('private:', '');
                    }
                    else if(channel.startsWith('presence:'))
                    {
                        channel = channel.replace('presence:', '');
                    }

                    this.$echo.leave(channel);
                })
            }
        })
    }
}