<template>
    <div class="bodyWrap"> 
        <LeftMenuList></LeftMenuList>   
        <div class="contentArea">
            <HeadComponent></HeadComponent>
            <router-view></router-view> 
        </div> 
    </div>
</template>

<script>
import HeadComponent from './container/headComponent'
import LeftMenuList from './container/leftMenuList'
export default {
    name: 'index',
    data () {
        return {
        
        }
    },
    components: {
        HeadComponent,
        LeftMenuList
    }
}
</script>
<style scoped lang="less">
.bodyWrap{
    height: 100%;
    background-color: rgba(244, 248, 252, 1);
    display: flex;
    width: 100%;
    flex-flow:row;
    .contentArea{
        flex:1;
        height:100%;
    }
}
</style>
