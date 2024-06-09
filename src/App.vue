<script setup>
import { onMounted, ref, watch } from 'vue'
import { fetchMotivation } from './components/FetchData.js';
import skeleton from './components/Skeleton.vue';
// Initialize refs
const motivationData = ref(null)
const motivationErrorMessage = ref('');
const isLoading = ref(true);
const isAutoDisplay = ref(false);
let autoFetchInterval = null;


const handleMotivationText = async() => {
    try {
    isLoading.value = true;
    const { apiArray, errorMessage } = await fetchMotivation();
    motivationData.value = apiArray.value;
    motivationErrorMessage.value = errorMessage.value;
  } catch (error) {
    motivationErrorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
  }

  
const startAutoFetch = () => {
  stopAutoFetch(); // Ensure any existing interval is cleared
  autoFetchInterval = setInterval( handleMotivationText, 4000);
};

const stopAutoFetch = () => {
  if (autoFetchInterval) {
    clearInterval(autoFetchInterval);
    autoFetchInterval = null;
  }
};

const handleAutoGenerateButton =() => {
  isAutoDisplay.value = true;
  startAutoFetch()
}


const handleGenerateButton = async() => {
  isAutoDisplay.value = false;
  stopAutoFetch();
  await fetchMotivation();
}

watch(isAutoDisplay, (newVal) => {
  if (newVal) {
    startAutoFetch();
  } else {
    stopAutoFetch();
  }
});

onMounted(() => {
  handleMotivationText()
})


</script>

<template>
  <div class=" w-full h-[800px] bg-[#ebffe4]">
    <h1 class="text-5xl font-bold pt-[50px] animate-bounce text-center text-[#60be35]">Motivation Quote </h1>
    <div class="md:w-[70%] w-[90%] pt-[100px] mb-[20px] m-auto flex justify-between">
      <button @click="handleAutoGenerateButton" class="px-[30px] py-[15px] rounded-md bg-[#60be35] font-bold border text-[#cafdbb] shadow-[#d0e2ce] shadow-md">Auto Generate</button>
      <button @click="handleGenerateButton" class="px-[30px] py-[15px] rounded-md bg-[#60be35] font-bold border text-[#cafdbb] shadow-[#d0e2ce] shadow-md">Generate with Button</button>
    </div>
    <div class="flex justify-center items-center">
      <div v-if="motivationErrorMessage">{{ motivationErrorMessage.value }}</div>

      <div v-else-if="!isLoading && motivationData" class="md:w-[70%] w-[90%] pb-[100px] text-center pt-[100px] rounded-md h-[50%] shadow-[#d0e2ce] shadow-md bg-[#cafdbb]">
        <h1 class="uppercase font-bold text-3xl text-[#60be35]">Daily Motivation.</h1>
        <p class="pt-[30px] font-medium text-2xl text-[#60be35]" v-for="data in motivationData">{{ data.advice }}</p>
        <button v-if="!isAutoDisplay" @click="handleMotivationText" class="px-[30px] bg-[#60be35] py-[15px] rounded-md text-[#cafdbb] font-bold mt-[50px] border">Generate More.</button>
      </div>

      <div class="md:w-full w-full" v-else>
        <skeleton />
      </div>
    </div>
  </div>
</template>
