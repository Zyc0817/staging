import Cookie from 'js-cookie'
const mixin = {
    data() {
        return {
            fixed: false,
            

        }
    },
    filters:{
        phoneNumber(val) {
            if(val&&val.length==11){
                return `${val.substring(0,3)}-${val.substring(3,7)}-${val.substring(7,11)}`
            }else{
                return val
            }
        },
        tofixed2(val) {
            if (val) {
				return val.toFixed(2)
			}else{
				return val
			}
        },
        agencyName(val) {
            if(val&&val.length>6){
                return val.substring(0,6)+'...'
            }else{
                return val
            }
        }
    },
    computed:{
        uploadHeader() {
			let token = Cookie.get("token")
			return {'Authorization':'Bearer ' + token}
		}
    },
    methods:{
        onScroll() {
			let top = document.getElementsByClassName("panel")[0].scrollTop
            if (top>=0) {
                this.fixed = true
            } else {
                this.fixed = false
            }
		},
    }
}

export default mixin