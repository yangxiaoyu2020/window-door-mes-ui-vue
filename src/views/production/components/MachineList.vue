<template>
  <div>
    <h1>Machine List</h1>
    <ul>
      <li
        v-for="machine in machines"
        :key="machine.id"
        @click="selectMachine(machine)"
        :class="{ selected: machine.id === selectedMachineId }"
      >
        {{ machine.name }}
      </li>
    </ul>
    <MachineDetail v-if="selectedMachineId !== null" :machineId="selectedMachineId" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import MachineDetail from "./MachineDetail.vue";

interface Machine {
  id: number;
  name: string;
}

const machines = ref<Machine[]>([
  { id: 1, name: "Machine 1" },
  { id: 2, name: "Machine 2" },
  { id: 3, name: "Machine 3" },
]);

const selectedMachineId = ref<number | null>(null);

const selectMachine = (machine: Machine) => {
  selectedMachineId.value = machine.id;
};
</script>

<style scoped>
ul {
  list-style: none;
  padding: 0;
}

li {
  cursor: pointer;
  padding: 10px;
  border: 1px solid #ccc;
  margin: 5px 0;
}

li.selected {
  background-color: #f0f0f0;
  border-color: #888;
}
</style>
