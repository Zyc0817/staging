export default {
	// 时间戳转年月日
	formattingTime(timestamp,type) {
		if (timestamp == null) {
			return
		}
		timestamp = parseInt(timestamp);
		let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		let Y = date.getFullYear();
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
		let D = date.getDate()<10 ? '0' + date.getDate() : date.getDate();
		if (type == '-') {
			return  Y+'-'+M+'-'+D;
		}
	    return Y+'/'+M+'/'+D;
	},
	//年月日转时间戳
	dateforTimestamp(date) {
		let d = new Date(date)
		let t = d.getTime(d)
		return t
	},
	formatTimeToMDHM(timestamp) {
		if (timestamp == null) {
			return
		}
		timestamp = parseInt(timestamp);
		let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1);
		let D = date.getDate()<10 ? '0' + date.getDate() : date.getDate();
		let H = date.getHours()<10 ? '0' + date.getHours() : date.getHours();
		let Mi = date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes();
		return M+'/'+D+'\xa0\xa0'+H+':'+Mi
	},
	formattingHover(timestamp) {
		if (timestamp == null) {
			return
		}
		timestamp = parseInt(timestamp);
	    let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
	    let H = date.getHours()<10 ? '0' + date.getHours() : date.getHours();
		let M = date.getMinutes()<10 ? '0' + date.getMinutes() : date.getMinutes();
		return H+':'+M
	},
	// 扁平数组转树状
	formattingJson(list) {
		let temp = {}
		let tree = {}
		for(let i in list){
			temp[list[i].id] = list[i]
		}

		for(let i in temp){
			if(temp[i].parentId!=0) {
				if(!temp[temp[i].parentId].children) {
					temp[temp[i].parentId].children = new Array()
				}
				temp[temp[i].parentId].children.push(temp[i])
			} else {
				tree[temp[i].id] = temp[i]
			}
		}
		return tree
  },
    //扁平数组转树状，可以没有根节点
  buildTree(arr) {
    let findTopParent = (arr, item)=>{
      let idx = arr.findIndex(ele => ele.id == item.parentId);
      if(idx == -1){
        return item;
      }
      return findTopParent(arr, arr[idx]);
    };
    let buildChildren = (arr, item) =>{
      let children = arr.filter(el=>el.parentId == item.id);
      if(children.length == 0){
        return;
      }
      item.children = children;
      children.forEach(c => {
        buildChildren(arr, c);
      });
    };
    let topItems = arr.reduce((p,c)=>{
      let top = findTopParent(arr, c);
      if(p.findIndex(e=>e.id==top.id) == -1){
        p.push(top);
      }
      return p;
    },[]);
    topItems.forEach(it=>{
      buildChildren(arr, it);
    });
    return topItems;
	},
	buildTree1(arr) {
    let findTopParent = (arr, item)=>{
      let idx = arr.findIndex(ele => ele.id == item.parentId);
      if(idx == -1){
        return item;
      }
      return findTopParent(arr, arr[idx]);
		};
		let orderSort = (a, b)=>{
			return a.orders-b.orders
		}
    let buildChildren = (arr, item) =>{
      let children = arr.filter(el=>el.parentId == item.id);
      if(children.length == 0){
        return;
      }
			item.children = children.sort(orderSort);
      children.forEach(c => {
        buildChildren(arr, c);
      });
    };
    let topItems = arr.reduce((p,c)=>{
      let top = findTopParent(arr, c);
      if(p.findIndex(e=>e.id==top.id) == -1){
        p.push(top);
      }
      return p;
    },[]);
    topItems.forEach(it=>{
      buildChildren(arr, it);
    });
    return topItems;
  },
	// 时间差
	timeDifference(type, start, end) {
		let utc
		if (start>end) {
			utc = start-end
		} else {
			utc = end-start
		}
		switch(type) {
			case 'day':
				return parseInt(utc/(24*60*60*1000))+1
				break
			case 'hover':
				return parseInt(utc/(60*60*1000))
				break
			case 'minutes':
				return parseInt(utc/(60*1000))
				break
			default:
		}
	},
	// H:M转毫秒
	timeplateToss(time) {
		if (time) {
			let arr = time.split(":")
			let ss = parseInt(arr[0]) * 60 * 60 * 1000 + parseInt(arr[1]) * 60 * 1000
			return ss
		}else{
			return ''
		}
	},
	timeplateTohm(time) {
		if (time) {
			let H = parseInt(time / (60 * 60 * 1000)) < 10 ? "0" + parseInt(time / (60 * 60 * 1000)) : parseInt(time / (60 * 60 * 1000))
			let M = parseInt((time % (60 * 60 * 1000)) / (60 * 1000))
			M = M < 10 ? "0" + M : M
			return H + " : " + M
		}else if(time==0){
			return '00 : 00' 
		}else{
			return ''
		}
	},
	age(timestamp) {
		if (timestamp == null) {
			return
		}
		timestamp = parseInt(timestamp);
		let date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
		let date1 = new Date();
		let Y = date.getFullYear();
		let Y1 = date1.getFullYear();
		return Y1 - Y
	},
	isPositiveInteger(s) {
		var re = /^[0-9]+$/ ;
     	return re.test(s)
	},
	timeplateToZhCn(time) {
		if(time) {
			let H = parseInt(time / (60 * 60 * 1000)) < 10 ? parseInt(time / (60 * 60 * 1000)) : parseInt(time / (60 * 60 * 1000))
			let M = parseInt((time % (60 * 60 * 1000)) / (60 * 1000))
			M = M < 10 ?  M : M
			return H + "小时" + M + "分"
		}else{
			return ''
		}
	},
	getBrowser() {
		var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串

		var isOpera = userAgent.indexOf("Opera") > -1;

		if (isOpera) {

			return "Opera"

		}; //判断是否Opera浏览器

		if (userAgent.indexOf("Firefox") > -1) {

			return "FF";

		} //判断是否Firefox浏览器

		if (userAgent.indexOf("Chrome") > -1){

			return "Chrome";

		}

		if (userAgent.indexOf("Safari") > -1) {

			return "Safari";

		} //判断是否Safari浏览器
		if (!!window.ActiveXObject || "ActiveXObject" in window) {

			return "IE";

		}; //判断是否IE浏览器
	}
}
