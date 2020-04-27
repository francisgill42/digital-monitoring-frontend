<template>
<div>

<v-btn dark color="primary" small @click="show = true">List View</v-btn>
<v-btn class="md-ml-12" small @click="show = false" dark color="primary">Tree View</v-btn>      

<v-row>
<v-col cols="12">
<v-timeline v-if="activities.length > 0 && !show">
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

<v-col>

<v-data-table v-if="activities.length > 0 && show"
:headers="headers"
:items="activities"
:search="search"
class="elevation-1"
>
<template v-slot:top>
<v-toolbar flat color="">
<v-toolbar-title>{{model | caps}}</v-toolbar-title>
<v-divider
class="mx-4"
inset
vertical
></v-divider>

<v-text-field
v-model="search"
label="Search"
single-line
hide-details
></v-text-field>

</v-toolbar>
</template>

</v-data-table>
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

search:'',
show:true,
headers: [
{
text: '#',
align: 'left',
sortable: false,
value: 'id',
},
{
text: 'Activity',
align: 'left',
sortable: false,
value: 'activity',
},
{
text: 'Created At',
align: 'center',
sortable: false,
value: 'created_at',
},      
],
}),
async created () {
const activities = await this.$axios.get(`activity/${this.$route.params.id}`);     
this.activities = activities.data;

const users = await this.$axios.get('user');
this.users = users.data;

},
filters:{
    caps(val){
      val = val.toString()
      return val.charAt(0).toUpperCase() + val.slice(1)
    }
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