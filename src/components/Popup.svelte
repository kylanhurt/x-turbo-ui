<script lang="ts">
	import { onMount } from 'svelte';
    import { storage } from "../storage";
    import { Button } from '$lib/components/ui/button/index.js';
    import { checkIfValidated } from '../util';
    import axios from 'axios'

    const VITE_API_DOMAIN = import.meta.env.VITE_API_DOMAIN

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
    onMount(() => {
        console.log('Popup.svelte onMount')
        fetchTwitterSigninUrl()
    })

    const startValidationPolling = async () => {
        console.log('in startValidationPolling')
        console.warn('in startValidationPolling')
        // get oauth_token query param from url
        const urlParams = new URLSearchParams(url.split('?')[1])
        const oauthToken = urlParams.get('oauth_token')
        const unixTimestamp = new Date().getTime()
        console.log('startValidationPolling unixTimestamp', unixTimestamp)
        const expires = 15 * 60 * 1000 + unixTimestamp
        chrome.storage.local.set({ validationOauthToken: `${oauthToken}:${expires}` })
        checkIfValidated(oauthToken, 3000, expires)
        window.open(url, '_blank')
    }

</script>

<div class="min-w-[250px] p-2">
    {#if user}
        Popup User Info
    {:else}
        <button on:click={() => startValidationPolling()}>
            Popup Log in
        </button>
    {/if}
</div>
