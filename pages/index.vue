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
    :color="change_color(elem.progress.progress)"

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
methods:{
        change_color(val) {
  
        if(val >=  0 && val <= 20){
        return 'red'
        }
        else if (val > 20 && val <= 40){
        return 'grey'
        }
        else if(val > 40 && val < 60){
        return 'info'
        }        else if(val > 0 && val < 80){
        return 'primary'
        }
        else{
        return 'green'
        }

      },

}
}
</script>
