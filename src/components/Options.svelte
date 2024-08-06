<script lang="ts">
	import { onMount } from 'svelte';
    import { storage } from "../storage";
    import { Button } from '$lib/components/ui/button/index.js';
    import axios from 'axios'
    
    const VITE_API_DOMAIN = import.meta.env.VITE_API_DOMAIN

    export let user
    let url
    let tokenSecret

    const fetchTwitterSigninUrl = async () => {
        console.log('onMounted fetchTwitterSigninUrl')
        // get random string as ID for this request
        const oauthRequestID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        console.log('oauthRequestID:', oauthRequestID)
        chrome.storage.local.set({ oauthRequestID })
        try {
            ({ data: { tokenSecret, url } } = await axios.get(`${VITE_API_DOMAIN}/twitter/request-token?rand=${oauthRequestID}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }))
            // get oauth_token query param from url
            const urlParams = new URLSearchParams(url.split('?')[1])
            const oauthToken = urlParams.get('oauth_token')
            const checkIfValidated = async () => {
                try {
                    const { data: { isValidated, user } } = await axios.get(`${VITE_API_DOMAIN}/twitter/validated?oauth_token=${oauthToken}`, {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                    console.log('isValidated:', isValidated)
                    if (isValidated) {
                        chrome.storage.local.set({ user })
                    } else {
                        console.log('not validated yet')
                        setTimeout(checkIfValidated, 3000)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
            console.log('fetchTwitterSigninUrl tokenSecret, url:', tokenSecret, url)
        } catch (err) {
            console.error(err)
        }
    }
    console.log('Options.svelte render')
    onMount(() => {
        console.log('Options.svelte onMount')
        fetchTwitterSigninUrl()
    })

</script>

<div class="min-w-[250px] p-2">
    {#if user}
        User Info
    {:else}
        <a href={url} target="_blank">
            Log in
        </a>
    {/if}
</div>
