trigger = function(event, data, elem, onlyHandlers){

	//触发的元素节点不能是文本节点和注释节点
　　if(elem && (elem.nodeType === 3 || elem.nodeType ===8)){

　　　　return;

　　}

　　var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType, type = event.type || event , namespaces =[];

	//如果事件类型带点号，就代表有命名空间，所以需要分解出命名空间
　　if(type.indexOf(".") >= 0 ){

　　　　namespaces = type.split(".");

　　　　type = namespaces.shift();

　　　　namespaces.sort();

　　}

　　if((!elem || jQuery.event.customEvent [ type ]) && !jQuery.event.global[type]){  //如果元素不存在或者事件类型是自定义事件，并且之前从来没有绑定过此类型的事件，那么就直接返回。

　　　　return;

　　}

	//如果事件类型没有:字符，就证明是ontype绑定事件
　　ontype = type.indexOf(":") < 0 ? "on" + type : ""; 

	//如果没有指明触发元素，就把整个缓存系统找一遍
　　if(!elem){

　　　　cache = jQuery.cache;

　　　　for(i in cache){

			//从缓存系统中，找相对应的events属性，并找到要触发事件类型的events[type]
　　　　　　if(cache[i].events && cache[i].events[ type ]){

				//触发所有绑定了此事件类型的回调方法。
　　　　　　　　jQuery.event.trigger(event,data,cache[i].handle.elem,true);

　　　　　　}

　　　　}

　　　　return;   //直接返回

　　}
	
	//清掉event的result属性，方便重复使用。
　　event.result = undefined;

　　if(!event.target){

　　　　event.target = elem;

　　}
	
	//如果传入了参数，就把参数转换成数组类型
　　data = data!=null ? jQuery.makeArray(data) :[];

	//把事件对象放入数组的第一项
　　data.unshift(event);

	//事件类型是否需要进行特殊化处理，比如：mousescroll事件
　　special = jQuery.event.special[type] || {};

	//如果事件类型已经有trigger方法，就调用它，如果返回结果是false，就直接返回。
　　if(special.trigger && special.trigger.apply(elem,data) === false){

　　　　return;

　　}
	
	//规划冒泡的路径，从当前元素，一直到window
　　eventPath = [[elem, special.bindType || type]];
	
	//如果元素的事件类型没有阻止冒泡，并且元素不是window对象，就要进行冒泡模拟。
　　if(!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)){

		//得到事件的类型
　　　　bubbleType = special.delegateType || type;

　　　　cur = elem.parentNode;
		
		//把当前元素的所有父元素，都进行一次事件类型的冒泡。
		/*假设div1（当前元素，触发click事件）上面有一个div2，div2上面有body，body上面有html，html上面有document。
		那么eventPath的数组是：[[div1,click],[div2,click],[body,click],[html,click],[document,click]]*/
　　　　for(old = elem; cur ; cur = cur.parentNode){

　　　　　　eventPath.push([cur, bubbleType]);

　　　　　　old = cur;

　　　　}
		
		//当old为document时，cur为空，就退出循环
　　　　if(old === (elem.ownerDocument || document)){

			//模拟冒泡到window对象
　　　　　　eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);

　　　　}

　　}
	
	//沿着上面规划好的冒泡路线，把经过的元素节点的指定类型事件的回调逐一触发执行
　　for(i=0;i<eventPath.length&&!event.isPropagationStopped(); i++){

　　　　　　cur = eventPath[i][0];   //元素

　　　　　　event.type = eventPath[i][1]   //事件类型
			
			//先判断在缓存系统中是否有此元素绑定的此事件类型的回调方法，如果有，就取出来。
　　　　　　handle = (jQuery._data(cur,"events") || {})[event.type] && jQuery._data(cur,"handle");

　　　　　　if(handle){   //执行这些回调方法

　　　　　　　　handle.apply(cur,data);

　　　　　　}
			
			//如果有onXXX绑定的回调，无论是写在js中，还是html标签内，都会取到
　　　　　　handle = ontype && cur[ontype];
			
			//如果handle不为空，并且当前元素能绑定数据，并且handle有apply方法，就执行handle回调方法，如果当前回调返回false，就阻止默认事件。
　　　　　　if(handle && jQuery.acceptData(cur) && handle.apply && handle.apply(cur, data) === false){

　　　　　　　　event.preventDefault();　　　　　　　

　　　　　　}

　　}

　　event.type  = type;
	
	/*如果没有执行preventDefault方法，或上面的handle方法返回false（也会阻止默认事件）。
	就模拟默认行为。具体是指模拟：submit，blur，focus，select，reset，scroll等方法。*/
　　if(!onlyHandlers &&  !event.isDefaultPrevented()){

		//如果用户指定了默认行为，就执行指定的默认行为，如果指定的默认行为返回false，就继续判断下面的条件
　　　　if((!special._default || special._default.apply(elem.ownerDocument,data) === false) && 

				//如果事件类型是click，并且是在a标签上触发的，就不执行它的默认行为了，否则继续判断
　　　　　　　　!(type === "click" && jQuery.nodeName(elem, "a"))&& 
					
					//如果当前元素可以绑定数据
　　　　　　　　　　jQuery.acceptData(elem)){   

						/*如果元素有onXXX回调，并且元素有type方法，比如:<input type ="submit" onsubmit="function(){}">，
						它有onXXX的回调方法,也有input.submit的方法，因此继续判断*/
　　　　　　　　　　　　if(ontype && elem[type] && 

							/*如果事件类型不是focus，blur。或事件类型是focu，blur，
							但是触发这个事件的元素不是隐藏的（隐藏的元素，它的offsetWidth为0），
							就继续判断。（触发隐藏元素的focus和blur默认行为，IE6-8下会抛出错误。）*/
　　　　　　　　　　　　　　((type!=="focus" && type!=="blur") || event.target.offsetWidth !==0) && 
								
								/*不是window元素就进入if语句执行默认行为。
								（window的默认行为触发，会出现问题，
								比如：window.scroll方法，在IE与标准浏览器存在差异，IE会默认scroll()方法为scroll(0,0)）*/
　　　　　　　　　　　　　　　　!jQuery.isWindow(elem)){

　　　　　　　　　　　　　　　　　　old = elem[ontype];

　　　　　　　　　　　　　　　　　　if(old){

										//onXXX的回调已经执行过了，就不用再次执行了
　　　　　　　　　　　　　　　　　　　　elem[ontype] = null;

　　　　　　　　　　　　　　　　　　}
									
									//标识正在触发此事件类型，防止下面的elem [ type ] ()重复执行dispatch方法
　　　　　　　　　　　　　　　　　　jQuery.event.triggered = type;   

　　　　　　　　　　　　　　　　　　elem [ type ] ();
									
									/*执行默认行为，比如:input[submit](),input元素的提交方法。
									点击类型为submint的input，会默认执行submit属性方法。但是这里不会调用dispatch方法。*/
　　　　　　　　　　　　　　　　　　jQuery.event.triggered = undefined;  //还原

　　　　　　　　　　　　　　　　　　if(old){

　　　　　　　　　　　　　　　　　　　　elem[ontype] = old;

　　　　　　　　　　　　　　　　　　}

　　　　　　　　　　　　}

　　　　}

　　}

　　return event.result;

}