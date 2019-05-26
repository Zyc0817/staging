<template>
    <div id="userLogin">   
        <div class="fn">
            <a href="https://www.lanniao.com" class="pictrue"><img src="../../assets/img/lanniaoyun.png" alt=""></a>
            <div class="content">
                <div class="logBox">
                    <p>预约体验</p>
                    <div class="success"><span><img src="../../assets/img/tiyan.svg" alt=""></span> <span>预约成功</span></div>
                    <div class="prompt"><span>三个工作日内将有蓝鸟工作人员联系您</span></div>
                    <div class="goBack"><span>3 秒钟后自动返回首页</span></div>                     
                  </div>               
            </div> 
            <footer class="footer">
                <p>
                    <span class="companyThat">© 2018 北京蓝鸟云科技有限公司 All Rights Reserved</span>
                    <span class="interval"></span><img src="../../assets/img/gonganju.png" alt="">
                    <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010502037467" style="color:#fff;">京公网安备11010502037467号</a>
                    <span class="interval"></span><a href="http://www.miitbeian.gov.cn/state/outPortal/loginPortal.action">京ICP备18064398号-2</a>
                </p>
            </footer>           
        </div>
    </div>
</template>
<script>
export default {
    name: 'appointmentSuccess',
    data() {
        return {
            _timeOut: ''
        }
    },
    created() {
        this.init()
    },
    methods:{
        init() {
           this._timeOut = setTimeout(()=>{
               this.$router.push({path: '/'})
           },3000)
        }
    }
}
</script>
<style lang="less" scoped>
#userLogin{
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    background: #f4f8fc;
    background: url('../../assets/img/beijing.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;
    .fn{    
        position: relative;       
        width: 100%;
        height: 100%;
        background: rgba(81, 88, 101, .5);
        .pictrue{
            display: inline-block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 60px;      
            background: #ffffff;          
            img{
                width: 139px;
                height: 24px;
                margin-top: 19px;
                margin-left: 100px;
            }
        }
    .content{
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;      
            .logBox{          
              width: 500px;
              height: 362px;
              margin-top: 60px;
              position: relative;
              background: rgba(255, 255, 255, .92);
              box-shadow: 0px 0px 12px 5px rgba(6, 29, 65, 0.1);
              border-radius: 5px;
              p{
                  width: 88px;
	              height: 30px;
                  font-size: 22px;
                  color: #444950;
                  margin: 40px auto;
              }
              .success{
                  display: flex;
                  justify-content: center;
                  margin-top: 83px;
                  img{
                      width: 25px;
                      height: 25px;
                  }
                  span:nth-child(2){
                      font-size: 18px;
                      color: #444950;
                      margin-left: 10px;
                  }
              }
              .prompt{
                  margin-left: 114px;
                  margin-top: 10px;
                  span{
                      font-size: 16px;
                      color: #444950;
                  }
              }
              .goBack{
                  margin-left: 183px;
                  margin-top: 92px;
                  span{
                      font-size: 14px;
                      color: #666666;
                  }
              }
               
          }
        }  
        .footer{
            width: 100%;
            height: 22px;
            position: absolute;
            bottom: 15px;
            p{
                width: 100%;
                height: 22px;
                text-align: center;
                color: #ffffff;
                font-size: 16px;
                margin-top: 0px;
                .companyThat,a{
                    font-size: 12px;
                    color: #ffffff;
                    font-family: 'PingFangSC-Medium';
                }
                .interval{
                    display: inline-block;
                    width: 1px;
                    height: 13px;
                    margin: -1px 10px;
                    background: #fff;
                }
                img{
                    width: 14px;
                    height: 13px;
                    margin-left: 2px;
                    margin-right: 3px;
                }
                a:nth-of-type(1){
                    position: relative;
                    &::after{
                        position: absolute;
                        top: 17px;
                        left: 0;
                        content: '';
                        display: none;
                        width: 165px;
                        height: 1px;
                        background: #fff;
                    }
                    &:hover::after{
                        display: inline-block;
                    }
                }
                a:nth-of-type(2){
                    position: relative;
                    &::after{
                        position: absolute;
                        top: 17px;
                        left: 0;
                        content: '';
                        display: none;
                        width: 125px;
                        height: 1px;
                        background: #fff;
                    }
                    &:hover::after{
                        display: inline-block;
                    }
                }
            }
        }  
    }   
}
</style>


