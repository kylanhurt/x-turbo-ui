<script lang="ts">
	import { onMount } from 'svelte';
    import axios from 'axios'

    const VITE_API_DOMAIN = import.meta.env.VITE_API_DOMAIN
    const imageURL =  chrome.runtime.getURL('src/assets/sign-in-with-twitter.png')

    export let user
    let url
    let tokenSecret
    let oauthToken

    const fetchTwitterSigninUrl = async () => {
        console.log('onMounted fetchTwitterSigninUrl')
        // get random string as ID for this request
        const oauthRequestID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        console.log('fetchTwitterSigninUrl oauthRequestID:', oauthRequestID)
        chrome.storage.local.set({ oauthRequestID })
        try {
            ({ data: { tokenSecret, url } } = await axios.get(`${VITE_API_DOMAIN}/twitter/request-token?rand=${oauthRequestID}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            }))
        } catch (err) {
            console.error(err)
        }
    }
    console.log('fetchTwitterSigninUrl Popup.svelte render')
    onMount(async () => {
        console.log('Popup.svelte onMount')
        const { user: storedUser } = await chrome.storage.local.get('user')
        if (storedUser) user = storedUser
        else fetchTwitterSigninUrl()

    })

    const sendStartValidationPollingMessage = async () => {
        if (!url) throw new Error('sendStartValidationPollingMessage url is not defined')
        console.log('first sendStartValidationPollingMessage executing', url)
        await chrome.runtime.sendMessage({ type: "startValidationPolling", data: { url } })
        open(url, '_blank')
    }
    
    addEventListener("storage", (event) => {
        console.log('storage event', event)
    });
</script>

<div class="min-w-[250px] p-2">
    {#if user}
        <div>
            <p>{user.userId}</p>
            <p>{user.userName}</p>
        </div>
    {:else}
        <div on:click={sendStartValidationPollingMessage}>
            <img src={imageURL} alt="Sign in with Twitter" />
        </div>
    {/if}
</div>
