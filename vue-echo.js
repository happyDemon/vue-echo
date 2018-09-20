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

                if(channel)
                {
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

                    let events = this.$options['echo'];

                    if(events)
                    {
                        Object.keys(events).forEach(function(key){
                            // Bind the VM as second parameter
                            this.channel.listen(key, (payload) => {
                                events[key](payload, this);
                        });
                        }, this);
                    }
                }
            },
            beforeDestroy(){
                let channel = this.$options['channel'];

                if(channel){
                    if(channel.startsWith('private:'))
                    {
                        channel = channel.replace('private:', '');
                    }
                    else if(channel.startsWith('presence:'))
                    {
                        channel = channel.replace('presence:', '');
                    }

                    this.$echo.leave(channel);
                }
            }
        })
    }
}