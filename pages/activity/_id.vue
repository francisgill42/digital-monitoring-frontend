<template>
  <div>
      
   <v-timeline v-if="activities.length > 0">
      <v-timeline-item
        v-for="(activity,index) in activities"
        :key="index"
       >
      
        <span slot="opposite">{{activity.created_at}}</span>
        <v-card class="elevation-2">
          <v-card-title class="headline">{{activity.activity}}</v-card-title>
          <v-card-title class="headline">{{activity.user.name}}</v-card-title>
          <v-card-title class="headline">
          <v-icon @click="deleteItem(activity)" color="error">
            mdi-delete
          </v-icon>
          </v-card-title>
           </v-card>
      </v-timeline-item>
    </v-timeline>
    <div v-else class="headline text-md-center mt-5">
        There is no activity
    </div>
  </div>
</template>
<script>
  export default {
    data: () => ({
        model:'activity',
        activities:[],
        users:[],
    }),
    async created () {
        const activities = await this.$axios.get(`activity/${this.$route.params.id}`);     
        this.activities = activities.data;

        const users = await this.$axios.get('user');
        this.users = users.data;

    },
   methods:{
      deleteItem (val) {
        
        confirm('Are you sure you want to delete this item?') && 

        this.$axios.delete(`${this.model}/${val.id}`)
        
        .then((res) => {
        
        if(res.data.response_status){ 
        
            const index = this.activities.indexOf(val)
        
            this.activities.splice(index, 1)
        }
        
        }).catch(err => console.log(err));
    }
   }
  }
</script>