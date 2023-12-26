<template>
  <main class="mobile:flex mt-12 h-screen">
    <section
      class="h-fit border-b-2 mobile:border-r-2 mobile:h-screen mobile:w-2/5 mobile:mx-12"
    >
      <div class="border-b-2">
        <h1 class="text-base font-semibold">Messages</h1>
      </div>

      <div class="grid gap-2 justify-items-start mobile:mr-4 mt-6">
        <h1 class="text-3xl font-semibold">Welcome to your inbox!</h1>
        <h2 class="text-sm mr-2">
          Drop a line, share posts and more with private conversations between
          you and others on Academia.
        </h2>
        <button class="mt-5 mb-5">Write a message</button>
      </div>
    </section>

    <section class="ml-2 grid place-content-center mt-6">
      <div class="grid gap-2 justify-items-start">
        <h1 class="text-3xl font-semibold">Select a message</h1>
        <h2 class="text-sm">
          Choose from your existing conversations, start a new one, or just keep
          swimming.
        </h2>
        <button class="mt-5">New message</button>
      </div>
      <div>
        <!--chats-->
      </div>
    </section>
  </main>
</template>

<script>
definePageMeta({
  layout: "dashboard",
});
</script>
