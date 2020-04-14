<template>
<v-app>
  <div class="text-center ma-2">

    <v-snackbar
      v-model="snackbar"
      :top="'top'"
    >
      {{response.msg}}
      <v-btn      
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
  <v-data-table
    :headers="headers"
    :items="records"
    :search="search"
    class="elevation-1"
  >
    <template v-slot:top>
      <v-toolbar flat color="">
        <v-toolbar-title>{{ model | caps }}</v-toolbar-title>
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
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>
       <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary"  class="mb-2" v-on="on">New Item</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                    <v-text-field v-model="editedItem.task" :label="model | caps"></v-text-field>
                 
                  </v-row>
                   <v-row v-if="errors.task">
                   <span class="error--text">{{errors.task[0]}}</span>
                   </v-row>
                    <v-row>
                    <v-select v-model="editedItem.project_id" :items="projects" item-value="id" item-text="name" label="Projects"></v-select>
                    </v-row>
                      <!-- <v-row>
                    <v-select v-model="editedItem.user_id" :items="users" item-value="id" item-text="name" label="Users"></v-select>
                    </v-row> -->
                   
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.assigned_by_user.name="{ item }">

       {{item.user ? item.user.name : 'self' }}

    </template>
    <template v-slot:item.action="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <!-- <v-btn color="primary" @click="initialize">Reset</v-btn> -->
    </template>
  </v-data-table>
  </v-app>
</template>
<script>
  export default {
    // async fetch({store}){
    //     await store.dispatch('getRoles')
    //   },

    data: () => ({
      user : '',
      model : 'task',
      search:'',
      snackbar:false,
      dialog: false,
      headers: [
        {
          text: '#',
          align: 'left',
          sortable: false,
          value: 'id',
        },
         {
          text: 'Task',
          align: 'left',
          sortable: false,
          value: 'task',
        },
        {
          text: 'Project',
          align: 'left',
          sortable: false,
          value: 'project.name',
        },
        {
          text: 'Assigned By',
          align: 'left',
          sortable: false,
          value: 'assigned_by_user.name',
        },
        {
          text: 'Assigned To',
          align: 'left',
          sortable: false,
          value: 'user.name',
        },         
        {
          text: 'Created At',
          align: 'left',
          sortable: false,
          value: 'created_at',
        },
        { text: 'Actions', value: 'action', sortable: false },
      ],
      editedIndex: -1,
      editedItem: {
        task: '',
        project_id:'',
        assigned_by:'',
        user_id:'',       
      },
      defaultItem: {
        task: '',
        project_id:'',
        assigned_by:'',
        user_id:'',      
      },
      response : {
        msg:''
      },
      records:[],
      users:[],
      projects:[],
      statusses:[],
        errors:[ {client:''} ]
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
      
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
    },

    async created () {

     this.user = this.$auth.user; 
     const record = await this.$axios.get(this.model);
     this.records = record.data;

     console.log(this.records);

    const projects = await this.$axios.get('project');
    this.projects = projects.data;

    // const users = await this.$axios.get('user');
    // this.users = users.data.filter(v => v.role_id == 2);

    },


      filters: {
      caps: function (value) {
        if(!value) return ''
        value = value.toString()
        return value.charAt(0).toUpperCase() + value.slice(1)
      },
    },

    methods: {

      editItem (item) {
          this.editedIndex = this.records.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete(this.model + '/'+item.id)
            .then((res) => {

              if(res.data.response_status){ 

              const index = this.records.indexOf(item)
              this.records.splice(index, 1)
              this.snackbar = res.data.response_status;             
              this.response.msg = res.data.message;

              }
            });
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      save () {
        let payload = { 
            task: this.editedItem.task,
            project_id: this.editedItem.project_id,
            status_id : 1,
            assigned_by : 0,
            user_id : this.user.id, 
            };

           if (this.editedIndex > -1) {

            this.$axios.put(this.model + '/' + this.editedItem.id, payload)
            .then(res => {
              if(res.data.response_status){ 
              const index = this.records.findIndex(item => item.id == this.editedItem.id)
              this.records.splice(index, 1, res.data.updated_record);
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;
              this.close()
              }
               else{
                this.errors = res.data
              }
            })
            .catch(error => console.log(error));
           }
           else{
              
            this.$axios.post(this.model, payload)
              .then((res) => {

              if(res.data.response_status){ 
                  console.log(res.data.new_record);
              this.records.push(res.data.new_record)
              this.snackbar = res.data.response_status;
              this.response.msg = res.data.message;

              this.close()
              
              }
              else{
                this.errors = res.data
              }

            });
         
           }

        
      },
    },
  }
</script>