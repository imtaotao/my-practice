/*
	快进的时候
	特征：
		1、当前 ac.currentTime = 0
		2、当前歌曲进度为 时间轴的占 百分比 * 歌曲总时间长 ，也就是 currentPlay（快进的时间）
		3、当前进度条的显示应该为 currentPlay（快进的时间）+ ac.currentTime
			才是真正的时间进度。

	再次快进的时候
		1、当前 ac.currentTime = 0
		2、当前歌曲进度为 也是时间轴的占 百分比 * 歌曲总时间长，也就是 currentPlay（快进的时间）
		3、当前进度条的显示应该为 currentPlay（快进的时间） +  ac.currentTime
*/

/*
	重复播放的时候
	特征：
		1、当前歌曲进度条为 ac.crrentTime - 两倍歌曲时长
*/

/*
	重复播放快进
	特征：
		1、当前 ac.currentTime = 0
		2、当前歌曲进度为 百分比 * 歌曲总时间长
		3、当前进度条为 currentPlay（快进的时间）+ ac.currentTime
*/