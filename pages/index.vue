<template>
<div>
    <v-row>
    <v-col md="4" v-for="(elem,i) in progress" :key="i" class="mb-3">
    <v-card>
    <v-card-title class="title">

    
    {{elem.name + ' ('+ elem.client.client + ')'}}
    <br>
    {{elem.status.name}}

    </v-card-title>
    <v-card-text>
    <v-progress-linear
    v-model="elem.progress.progress"
    height="20"
    color="primary"
    >
    <strong>{{ elem.progress.progress }}%</strong>
    </v-progress-linear>
    </v-card-text>
    </v-card>
    </v-col>
    </v-row>
</div>
</template>

<script>
import Progress from '~/components/Progress.vue'

export default {
  components: { Progress },
   data: () => ({
      progress:[],
    }),
  async created () {     
    const progress = await this.$axios.get('project');
    this.progress = progress.data;

},
}
</script>
