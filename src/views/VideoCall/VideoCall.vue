<template>
  <div class="home">  
    <h3>{{  uid }}</h3>
    
  </div>
</template>

<script lang="ts" setup>
import { ref , onMounted, watch} from 'vue'
import { useRoute,useRouter , onBeforeRouteUpdate} from 'vue-router'

let route = useRoute();
let router = useRouter() as any
let uid = ref('') as any

// 聊天内容
const text = ref('') as any
// 滚动
const scroll = () => {

}

onBeforeRouteUpdate((to) => {
  uid.value = route.query.uid
})


const getUid = () => {
  uid.value = route.query.uid
}
onMounted(() => {
  getUid()
})
 
watch(route, (newValue, oldValue) => {
  uid.value = newValue.query.uid 
})

</script>

<style scoped>
  
 .chat{
        background: rgb(247,247,247);
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .chat-boom{
        display: flex;
        justify-content: space-between;
        align-items: end;
    }
    .list-img{
        width: 40px;
        height: 40px;
        border-radius: 5px;
    }
    .chat-list{
        display: flex;
        flex-direction: column;
        height: 100%;
    }
    .chat-list-left{
        padding: 20px;
        display: flex;
        flex-direction: row;
    }
    .chat-list-right{
        padding: 20px;
        display: flex;
        flex-direction: row-reverse;
    }
    .left-msg{
        margin-left: 5px;
        background-color: #ffffff;
        font-size: 15px;
        border-radius: 6px;
        max-width: 200px;
        word-wrap:break-word
    }
    .right-msg{
        margin-right: 7px;
        background-color: #ffffff;
        font-size: 15px;
        border-radius: 6px;
        max-width: 200px;
        word-wrap:break-word
    }
</style>
