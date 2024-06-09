import {ref} from 'vue';

export const fetchMotivation = async() => {
    const apiArray = ref([]);
    const errorMessage = ref('');

    try{
        const response = await fetch('https://api.adviceslip.com/advice')
        if(!response.ok){
            throw new Error ('sorry can\'t fetch Motivation Data');
        }else{
            const data = await response.json();
            apiArray.value = data;
        }

    }catch(error){
        errorMessage.value = error.message
    }

    return {
        apiArray,
        errorMessage
    }
}