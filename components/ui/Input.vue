<template>
  <div class="mb-4">
    <label
      :for="uid"
      class="block uppercase text-xs font-medium text-gray-700"
      >{{ label }}</label
    >
    <input
      :id="uid"
      :value="value"
      @change="onChange($event.target.value)"
      type="text"
      class="mt-1 p-2 block w-full rounded-md border border-gray-300 shadow-sm"
    />
  </div>
</template>

<script setup>
import { emit } from "process";
import { onMounted, ref, watch } from "vue";

let uid = ref("");
let internal = ref("");

const props = defineProps({
  value: { type: String },
  label: { type: String },
});

const emit = defineEmits("update:value");

onMounted(() => {
  uid.value = "u" + ~~(Math.random() * 10000);
  internal.value = props.value;
});

function onChange(v) {
  internal.value = v;
  emit("update:value", v);
}
</script>
