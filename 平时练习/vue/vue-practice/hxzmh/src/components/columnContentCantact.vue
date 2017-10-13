<template>
<div class="mr_con same1" style="min-height:549px;">
	<table class="gridtable">
	    <tr>
	        <th>姓名</th>
	        <th>所属部门</th>
	        <th>职务</th>
	        <th>手机号码</th>
	        <th>固话</th>
	    </tr>
	    <tr>
	        <td>李顺</td>
	        <td>局领导</td>
	        <td>局长</td>
	        <td>133*********</td>
	        <td>8216206</td>
	    </tr>
	    <tr>
	        <td>马忠祥</td>
	        <td>局领导</td>
	        <td>副局长</td>
	        <td>138********</td>
	        <td>8216509</td>
	    </tr>
	</table>
</div>
</template>

<script>
	export default {
		data() {
			return {}
		}
	}
</script>

<style>
	.main .main_right .mr_con {
	    width: 740px;
	    padding: 10px;
	    height: auto;
	    border: 1px solid #dcdcdc;
	    border-top: none;
	}
	table.gridtable {
	    font-family: verdana,arial,sans-serif;
	    font-size: 14px;
	    color: #333333;
	    border-width: 1px;
	    border-color: #666666;
	    width: 100%;
	    border-collapse: collapse;
	}
	table.gridtable th {
	    border-width: 1px;
	    padding: 8px;
	    border-style: solid;
	    border-color: #dcdcdc;
	    text-align: center;
	    background-color: #eee;
	}
	table.gridtable td {
	    border-width: 1px;
	    padding: 8px;
	    border-style: solid;
	    text-align: center;
	    border-color: #dcdcdc;
	    background-color: #ffffff;
	}
	th{
		font-weight: bold;
	}
</style>