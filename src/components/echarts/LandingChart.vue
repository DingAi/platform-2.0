<template>
	<div class="size-full p-4" ref="loadingAnimation"></div>
</template>

<script setup lang="js">
import {onMounted, ref} from "vue";
import {refInitEcharts} from "@/utils/eharts-init.js";

const loadingAnimation = ref(null)

const option = {
	graphic: {
		elements: [
			{
				type: 'group',
				left: 'center',
				top: 'center',
				children: new Array(7).fill(0).map((val, i) => ({
					type: 'rect',
					x: i * 20,
					shape: {
						x: 0,
						y: -40,
						width: 10,
						height: 80
					},
					style: {
						fill: '#003f8f'
					},
					keyframeAnimation: {
						duration: 1000,
						delay: i * 200,
						loop: true,
						keyframes: [
							{
								percent: 0.5,
								scaleY: 0.3,
								easing: 'cubicIn'
							},
							{
								percent: 1,
								scaleY: 1,
								easing: 'cubicOut'
							}
						]
					}
				}))
			}
		]
	}
};

onMounted(() => {
	const dom = refInitEcharts(loadingAnimation.value, 'green');
	dom.setOption(option);
	window.addEventListener('resize', function () {
		dom.resize();
	});
})
</script>


<style scoped>

</style>