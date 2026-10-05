<script>
	import { writable } from 'svelte/store';

	const inputText = writable('');
	const responseText = writable('');

	async function postData() {
		const response = await fetch('http://localhost:8000', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ prompt: $inputText })
		});

		if (response.ok) {
			const data = await response.json();
			responseText.set(JSON.stringify(data));
		} else {
			responseText.set('Error posting data');
		}
	}
</script>

<input type="text" bind:value={$inputText} placeholder="Enter your text here" />
<button on:click={postData}>Submit</button>
<p>Response: {$responseText}</p>

<style>
	input,
	button,
	p {
		margin: 10px 0;
		display: block;
	}
</style>
