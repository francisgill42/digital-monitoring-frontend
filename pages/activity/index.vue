<template>
  <div>
    <v-row v-if="this.$auth.user &&  (this.$auth.user.role_id == 3 || this.$auth.user.master == 1)">
    <v-col md="4" v-for="(elem,i) in users" :key="i" class="mb-3">
    <v-card :to="`activity/${elem.id}`">
    <v-card-title class="title">
    {{elem.name}} ( {{elem.role.role}} )
     </v-card-title>
    <!-- <hr class="my-3" color="primary"> -->
    </v-card>
    </v-col>
    </v-row>
    <v-row v-else>
      <v-col md="12">
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
     </v-col>
    </v-row>

  </div>
</template>
<script>
  export default {
    data: () => ({
        model:'activity',
        activities:[],
        users:[],
        isAuthenticated:'',
    }),
    async created () {
        const activities = await this.$axios.get(`activity/${this.$auth.user.id}`);     
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