<template>
<v-container style="max-width: 500px">
<v-row align="center">
<v-col class="text-center" cols="12">
<h2 class="display-1 success--text pl-4">
Tasks:&nbsp;
<v-fade-transition leave-absolute>
<span :key="`tasks-${tasks.length}`">
{{ tasks.length }}
</span>
</v-fade-transition>
</h2>
<v-divider class="mt-4"></v-divider>

<v-row
class="my-1"
align="center"
>
<strong class="mx-4 info--text text--darken-2">
Remaining: {{ remainingTasks }}
</strong>

<v-divider vertical></v-divider>

<strong class="mx-4 success--text text--darken-2">
Completed: {{ completedTasks }}
</strong>

<v-spacer></v-spacer>

<v-progress-circular
:value="progress"
class="mr-2"
></v-progress-circular>
</v-row>
<v-divider class="mb-4"></v-divider>
<h1 class="display-1 font-weight-thin mb-2">
<v-row>
    <v-col>
        <v-select solo v-model="project_id" :items="projects" item-value="id" item-text="name" label="Projects"></v-select>                    
    </v-col>
        <v-col>
        <v-text-field v-model="task" label="What are you working on?" solo @keydown.enter="create">
<v-fade-transition v-slot:append>
<v-icon
v-if="task"
@click="create"
>
add_circle
</v-icon>
</v-fade-transition>
</v-text-field>
    </v-col>

</v-row>

</h1>

<h4 class="subheading">

<v-card v-if="tasks.length > 0">
<v-slide-y-transition
class="py-0"
group
tag="v-list"
>
<template v-for="(task, i) in tasks">
<v-divider
v-if="i !== 0"
:key="`${i}-divider`"
></v-divider>

<v-list-item :key="`${i}-${task.text}`">
<v-list-item-action>
<v-checkbox
v-model="task.done"
:color="task.done && 'grey' || 'primary'"
>
<template v-slot:label>
<div
:class="task.done && 'grey--text' || 'primary--text'"
class="ml-4"
v-text="task.text"
>
</div>
 &nbsp;(&nbsp;{{task.project}}&nbsp;)
</template>
</v-checkbox>
</v-list-item-action>

<v-spacer></v-spacer>

<v-scroll-x-transition>
<v-icon
v-if="task.done"
color="success"
>
mdi-check
</v-icon>
</v-scroll-x-transition>
</v-list-item>
</template>
</v-slide-y-transition>
</v-card>
</h4>
</v-col>
</v-row>








</v-container>
</template>
<script>

export default {

data: () => ({
project_id:'',    
task: null,
tasks: [],
projects:[],

}),

computed: {
completedTasks () {
return this.tasks.filter(task => task.done).length
},
progress () {
return this.completedTasks / this.tasks.length * 100
},
remainingTasks () {
return this.tasks.length - this.completedTasks
},
},

async created () {
    const tasks = await this.$axios.get('task');
      var new_array = tasks.data.map((v) => ({
        id : v.id,
        text: v.task,
        done: v.status_id == 1 ? false : true  ,
        project : v.project.name,
    }));
    this.tasks = new_array;

    const projects = await this.$axios.get('project');
    this.projects = projects.data;

},
methods: {
create () {

    var payload  = {
                task: this.task,
                project_id: this.project_id,
                status_id : 1,
                assigned_by : 0,
                user_id : this.$auth.user.id, 
    };

          this.$axios.post('task', payload)
              .then((res) => {

              if(res.data.response_status){ 
                  var res = {
                            id : res.data.new_record.id,
                            text: res.data.new_record.task,
                            done: res.data.new_record.status_id == 1 ? false : true  ,
                            project : res.data.new_record.project.name,
                  };
                   
                  this.tasks.push(res)
              
              }
   
            });
},
},
}
</script>