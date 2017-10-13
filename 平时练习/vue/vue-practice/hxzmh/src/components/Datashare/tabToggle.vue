<template>
<div >
    <div class="fg_change" style="display: block;">
        <div class="tabs tabs-vertical-left">
            <ul class="tabs-list">
                <li 
                v-for='(key, i) in tabList' 
                :class='{active: i === 0}'
                @click='toggleTab($event)'>
                    <a href="javascript:;">{{key}}</a>
                </li>
            </ul>
            <div class="tabs-container">
                <tab-content class='tab-content' :detailData='name'></tab-content>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import util from '@/common/util'
    import tabContent from './tabContent'

    export default {
        props: ['tabList'],
        data() {
            return {
                name: this.tabList[0]
            }
        },
        methods: {
            toggleTab( e ) {
                const target = e.currentTarget
                this.name = target.children[0].innerHTML
                
                util.removeClass(target, 'active')
                util.addClass(target, 'active')
            }
        },
        components: {
            tabContent
        }
    }
</script>

<style>
    .tabs-vertical-left .tabs-list {
        float: left;
    }
    .tabs-vertical-left .tabs-list, .tabs-vertical-right .tabs-list {
        width: 25%;
    }
    .tabs-list {
        list-style: none;
    }
    .tabs-vertical-left:before, .tabs-vertical-left:after, .tabs-vertical-right:before, .tabs-vertical-right:after {
        visibility: hidden;
        display: block;
        font-size: 0;
        content: " ";
        clear: both;
        height: 0;
    }
    .tabs-vertical-left .tabs-list li, .tabs-vertical-right .tabs-list li {
        display: block;
        margin: 0 0 5px 0;
        width: 100%;
    }
    .tabs-vertical-left .tabs-list li a, .tabs-vertical-right .tabs-list li a {
        height: auto;
        padding: 6px 10px;
        line-height: 1.5;
    }
    .tabs-list li.active a {
        background-color: #0d7eff;
        color: #fff;
    }
    .tabs-list li a {
        display: block;
        height: 38px;
        line-height: 38px;
        padding: 0 30px;
        background-color: #ebebeb;
        color: #808080;
        text-decoration: none;
        font-size: 14px;
        transition: all 0.4s ease 0s;
    }
    .tabs-vertical-left .tabs-container {
        float: right;
    }
    .tabs-vertical-left .tabs-container, .tabs-vertical-right .tabs-container {
        width: 75%;
    }
    .accordion-handle.active {
        background-color: #0d7eff;
        color: #fff;
    }
</style>