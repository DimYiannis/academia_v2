<template>
  <div class="">
    <!--svg -->
    <div class="tablet:flex grid mt-10 justify-items-center laptop:ml-32">
      <div
        class="tablet:w-1/2 mt-32 pl-5">
        <h1 class="text-3xl text-[#388aef] font-bold">Academia</h1>
        <p class="my-5 text-start text-lg bg-transparent">
          Where scientific research meet shared thoughts. Explore, share, and
          discuss the latest research with a global community of like-minded
          individuals. Join the conversation and fuel your intellectual journey
          in a space designed for collaboration and discovery. Academia:
          Connecting minds, advancing knowledge.
        </p>
        <button><NuxtLink to="/login">Login</NuxtLink></button>
        <button><NuxtLink to="/register">Register</NuxtLink></button>
      </div>

      <div>
        <img src="/img/6963.jpg" class="w-[500px] h-[500px] hidden tablet:block" />
      </div>
      <!--buttons -->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
     
    };
  }
};
</script>
