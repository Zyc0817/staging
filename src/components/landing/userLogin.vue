<template>
    <div id="userLogin">
        <div class="fn">
            <a href="https://www.lanniao.com" class="pictrue"><img src="../../assets/img/lanniaoyun.png" alt=""></a>
            <div class="content">
                    <div class="logBox">
                        <p>登录</p>
                        <div class="icon">
                            <div class="promptOne" v-if="emptyEmail"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入邮箱</span></div>
                            <div class="promptThe" v-if="effectiveEmail"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入有效邮箱</span></div>
                            <div class="promptTwo" v-if="errorPassword"><img src="../../assets/img/prompt1.svg" alt=""><span>请输入密码</span></div>
                            <div class="promptTwo" v-if="showIcon"><img src="../../assets/img/prompt1.svg" alt=""><span>该账号不存在</span></div>
                        </div>
                        <el-form ref="form" label-width="80px" size="medium">
                            <div class="email">
                                <el-input v-model="newEmail" placeholder="邮箱账号" type="email" @input="nice" @keydown.tab.native="email(newEmail)"></el-input>
                                <img src="../../assets/img/youxiang.svg" alt="">
                            </div>
                            <div class="password">
                                <el-input 
                                    :type='this.registration_data.pwdType' 
                                    v-model="newPassword" placeholder="密码" 
                                    @input="nice"
                                    @focus="email(newEmail)" 
                                    @keyup.enter.native="handleSubmit(newEmail,newPassword,value)">
                                </el-input>
                                <img src="../../assets/img/mima.svg" alt="" class="lock">
                                <img :src='registration_data.src' alt="" class="eye" @click="changeType()" v-if="newPassword">
                            </div>
                            <div class="company" v-if="list.length > 1">
                                <el-select v-model="value" placeholder="公司" @change="handleSubmit(newEmail,newPassword,value)">
                                    <el-option :label= i.name :value= i.id v-for="(i,k) in list" :key="k"></el-option>
                                </el-select>
                                <img src="../../assets/img/gongsi.svg" alt="">
                            </div>
                        </el-form>
                        <div class="logBodyThe">
                            <div class="forgotPassword">
                                <div @click="retrievePassword" class="forget">忘记密码？</div>
                            </div>
                            <div class="conform" @click.enter="conform(newEmail,newPassword,value)"><p>登录</p></div>
                            <div class="logfooter">
                                <p>还没有蓝鸟账号？</p>
                                <router-link tag="a" to="/experience" class="click">点击预约体验</router-link>
                            </div>
                        </div>
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
import Cookie from 'js-cookie'
import dynamicRouter from '../../router/dynamicRouter.js'
export default {
    name: 'userLogin',
    data() {
        return {
            _timeOut: '',
            newEmail: '',
            newPassword: '',
            registration_data:{
                pwdType:"password",
                src: require('../../assets/img/closeeye.svg')
            },
            list: [],
            value: '',
            showIcon: false,
            emptyEmail: 0,
            effectiveEmail: 0,
            errorPassword: 0,
            accountNumber: 1
        }
    },
    watch: {
        newEmail(newEmail) {
            if(newEmail.length>100){
                this._timeOut = setTimeout(()=>{
                    this.email(newEmail)
                }, 500)
            }
            
        }
    },
    created() {
        if(this.$store.state.menuItem.length) {
            // window.location.reload()
        }
        this.init()  
        this.email(localStorage.onlyEmail)  
    },
    methods:{
        retrievePassword() {
            this.$router.push({name:'retrievePassword'})
        },
        changeType() {
            this.registration_data.pwdType = this.registration_data.pwdType === 'password'?'text':'password';
            this.registration_data.src=this.registration_data.src == require("../../assets/img/closeeye.svg") ? require("../../assets/img/openeye.svg") : require("../../assets/img/closeeye.svg");
        },
        nice() {
            this.emptyEmail =  0
            this.effectiveEmail = 0
            this.errorPassword = 0
            this.showIcon = false
        },
        email(value){
            this.nice()
            let reg = /^([A-Za-z0-9_.]+\.)*[A-Za-z0-9]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(!value){
                return this.emptyEmail=1
            }else{
                if(!reg.test(value)){
                return this.effectiveEmail=1
                }else{
                    this.$axios({
                        method: 'get',
                        url: this.$urls.hotels,
                        params:{ account: value}
                    }).then(res=>{
                        if(res.data.length == 0){
                            this.accountNumber = res.data.length
                            this.showIcon=true
                            return
                        }else{
                            this.accountNumber = res.data.length
                            this.list = res.data
                            this.showIcon=false
                        }
                    }).catch(err=>{

                    })
                }
            }
        },
        init() {
            this.newEmail=localStorage.onlyEmail
            this.newPassword=localStorage.onlyPassWord
        },
        handleSubmit(email,password,value) {
            this.conform(email,password,value)
        },
        conform(email,password,value) {
            this.nice()
            let reg = /^[A-Za-z0-9_.\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if(email){
                if(reg.test(email)){
                    this.$axios({
                        method: 'get',
                        url: this.$urls.hotels,
                        params:{ account: email}
                    }).then(res=>{
                        if(res.data.length == 0){
                            this.showIcon=true
                            return
                        }else{
                            this.nice()
                        }
                    }).catch(err=>{
                        return
                    })
                }else if(!reg.test(email)){
                    this.effectiveEmail = 1
                    return
                }
            }else{ return this.emptyEmail=1 }
            if(this.accountNumber==0){
                return this.showIcon=true
            }
            this.$axios({
                method: 'post',
                url: this.$urls.login,
                data: {
                    username: this.newEmail,
                    password: this.newPassword,
                    hotalId: this.list.length>1?this.value:this.list[0].id
                }
            }).then(res=>{
                if(res.data.status == 200){  
                    Cookie.set('token', res.data.content.user.token)
                    localStorage.clear()
                    localStorage.setItem('hotalId', res.data.content.hotal.id)
                    localStorage.setItem('hotalName', res.data.content.hotal.name)
                    localStorage.setItem('departmentId', res.data.content.user.departmentId)
                    localStorage.setItem('userId', res.data.content.user.id)
                    localStorage.setItem('account', res.data.content.user.account)
                    this.$store.dispatch('setHotal',{id:res.data.content.hotal.id,name:res.data.content.hotal.name,avatar:res.data.content.user.avatar})
                    let menuList = res.data.content.menuList.filter(i=>i.keyCode!='C0000')
                    let arr = []
                    dynamicRouter.forEach(i=>{
                        menuList.forEach(j=>{
                            if(i.meta.roles[0]==j.keyCode){
                                arr.push({
                                    path:i.path,
                                    name:i.name,
                                    title:j.zhCn,
                                    icon: i.icon,
                                    component:i.component,
                                    parentId:j.parentId,
                                    id: j.id
                                })
                            }
                            i.children.forEach(k=>{
                                if(k.meta.roles[0]==j.keyCode){
                                    if(j.keyCode=="C6300"){
                                        let a = dynamicRouter.find(i=>i.meta.roles[0]=='C6000').children.find(j=>j.meta.roles[0]=='C6300').children
                                        arr.push({
                                            path:k.path,
                                            name:k.name,
                                            title:j.zhCn,
                                            component:k.component,
                                            parentId:j.parentId,
                                            id: j.id,
                                            children:a
                                        })
                                    }else{
                                        arr.push({
                                            path:k.path,
                                            name:k.name,
                                            title:j.zhCn,
                                            component:k.component,
                                            parentId:j.parentId,
                                            id: j.id
                                        })
                                    }     
                                }
                            })
                        })             
                    })   
                    let arr1 = arr.filter(i=>i)
                    arr1 = Object.values(this.$base.formattingJson(arr1))
                    this.$store.dispatch('setMenu')
                    let menu = JSON.stringify(res.data.content.menuList)
                    localStorage.setItem('menuList', menu)
                    localStorage.setItem('onlyEmail', res.data.content.user.email)
                    localStorage.setItem('onlyPassWord', this.newPassword)
                    this.newPassword = ''
                    localStorage.onlyPassWord = ''
                    if(sessionStorage.getItem('redirectUrl')){  
                        this.$router.push({path:decodeURIComponent(sessionStorage.getItem('redirectUrl')).split('#')[1]})
                    }else{
                        this.$router.push({path:'/index/homePage'})
                    }
                    }else{
                        this.$message({
                            message: res.data.message,
                            type: 'error',
                            duration: 5 * 1000
                        })
                    }
                    }).catch(err=>{
                        
                })
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
    overflow-y: hidden;
    background: url('../../assets/img/beijing.png') no-repeat;
    background-size: 100% 100%;
    .fn{
        position: relative;
        width: 100%;
        height: 100vh;
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
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .logBox{
              position: relative;
              width: 500px;
              margin-top: 60px;
              background: rgba(255, 255, 255, .92);            
              box-shadow: 0px 0px 12px 5px rgba(6, 29, 65, 0.1);
              border-radius: 5px;
              p{
                  width: 44px;
	              height: 30px;
                  font-size: 22px;
                  color: #444950;
                  margin: 40px auto;
              }
              .icon{
                  display: flex;
                  margin-left: 70px;
                  margin-top: -6px;
                  z-index: 99;
                  .promptOne{
                      height: 17px;
                      img{
                          float: left;
                          width: 12px;
                          height: 12px;
                          margin-right: 5px;
                          margin-top: 2.5px;
                      }
                      span{
                          font-size: 12px;
                          color: #e45a3c;
                      }
                  }
                  .promptTwo{
                      height: 17px;
                      img{
                          float: left;
                          width: 12px;
                          height: 12px;
                          margin-right: 5px;
                          margin-top: 2.5px;
                      }
                      span{
                          font-size: 12px;
                          color: #e45a3c;
                      }
                  }
                  .promptThe{
                      height: 17px;
                      img{
                          float: left;
                          width: 12px;
                          height: 12px;
                          margin-right: 5px;
                          margin-top: 2.5px;
                      }
                      span{
                          font-size: 12px;
                          color: #e45a3c;
                      }
                  }
                  .promptFor{
                      height: 17px;
                      img{
                          float: left;
                          width: 12px;
                          height: 12px;
                          margin-right: 5px;
                          margin-top: 2.5px;
                      }
                      span{
                          font-size: 12px;
                          color: #e45a3c;
                      }
                  }
                }
              .email{
                  position: relative;
                  img{
                      position: absolute;
                      top: 25.5px;
                      left: 70px;
                      width: 19px;
                      height: 14px;
                  }
              }
              .password{
                  position: relative;
                  .lock{
                      position: absolute;
                      top: 31px;
                      left: 72.5px;
                      width: 14px;
                      height: 20px;
                  }
                  .eye{
                      position: absolute;
                      top: 35px;
                      right: 72px;
                      width: 14px;
                      height: 12px;
                      cursor: pointer;
                  }
              }
              .company{
                  position: relative;
                  width: 400px;
                  margin-left: 50px;
                  img{
                      position: absolute;
                      top: 31px;
                      left: 21px;
                  }
              }
              .logBodyThe{
                  position: relative;
                  .inputOne{
                    width: 310px;
                    height: 44px;
                    margin-left: 50px;
                    margin-top: 20px;
                    background-color: #ffffff;
                    border-radius: 22px;
                    border: solid 1px #ececec;
                    outline: none;
                    padding-left: 90px;
                  }
                  .email{
                      width: 66px;
                      height: 20px;
                      position: absolute;
                      top: 11px;
                      left: 70px;
                      .emailLitter{
                          width: 32px;
                          font-size: 16px;
                          color: #999999;
                          margin-left: 10px;
                      }
                  }
                  .triangle{
                      position: absolute;
                      left: 418px;
                      top: 29px;
                  }
              }
              .forgotPassword{
                  width: 75px;
                  margin-left: 386px;
                  margin-top: 10px;
                  .forget{
                    width: 75px;
                    height: 20px;
                    color: #666666;
                    font-size: 14px;
                    cursor: pointer;
                    &:hover {
                      color: #4c8aff;
                  }
                  }
              }
              .conform{
                  width: 400px;
                  height: 44px;
                  margin: -23px auto;
                  border-radius: 22px;
                  line-height: 44px;
                  background-color: #4c8aff;
                  cursor: pointer;
                  p{
                      font-size: 16px;
                      color: #ffffff;
                  }
              }
              .logfooter{
                  height: 44px;
                  display: flex;
                  margin-top: 22.5px;
                  padding-bottom: 36.8px;
                  justify-content: space-around;
                  p{
                      width: 112px;
                      height: 20px;
                      font-size: 14px;
                      color: #666666;
                      margin-top: 10px;
                      margin-left: 138px;
                  }
                  .click{
                      position: relative;
                      width: 84px;
                      height: 20px;
                      margin-top: 10px;
                      margin-right: 156px;
                      font-size: 14px;
                      color: #4c8aff;
                      &:hover::after{
                          position: absolute;
                          top: 19.5px;
                          left: 0;
                          content: '';
                          width: 84px;
                          height: .5px;
                          background: #4c8aff;
                      }
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


