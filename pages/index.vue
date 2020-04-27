<template>
<div>
    <v-row>
    <v-col md="4" v-for="(elem,i) in progress" :key="i" class="mb-3">
    <v-card>
      <v-card-title style="margin-bottom:-30px;" class="primary--text">Project: <span class="black--text"> &nbsp;{{elem.name}}</span></v-card-title>
      <v-card-title style="margin-bottom:-30px;" class="primary--text">Client: <span class="black--text"> &nbsp;{{elem.client.client}}</span></v-card-title>
      <v-card-title style="margin-bottom:-30px;" class="primary--text">Resource: <span class="black--text"> &nbsp;{{elem.user.name}}</span></v-card-title>
      <v-card-title style="margin-bottom:-10px;" class="primary--text">Status: <span class="black--text"> &nbsp;{{elem.status.name}}</span></v-card-title>
   
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

export default {
   data: () => ({
      progress:[],
    }),
  async created () {     
    const progress = await this.$axios.get('project');
   
    this.progress = progress.data;

},
}
</script>
