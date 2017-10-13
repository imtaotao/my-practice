import news from '@/components/HomePage/news'
import announ from '@/components/HomePage/announ'
import quick from '@/components/HomePage/quick'
import official from '@/components/HomePage/official'
import envqua from '@/components/HomePage/envqua'
import policy from '@/components/HomePage/policy'

export default {
	home : [
		{path: '/home/news',	  component: news,		name: 'news'},
		{path: '/home/announ', 	  component: announ,	name: 'announ'},
		{path: '/home/quick', 	  component: quick,		name: 'quick'},
		{path: '/home/official',  component: official,	name: 'official'},
		{path: '/home/envqua', 	  component: envqua,	name: 'envqua'},
		{path: '/home/policy', 	  component: policy,	name: 'policy'},
	]
}