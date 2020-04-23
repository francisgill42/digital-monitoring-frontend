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
        <v-toolbar-title>Projects</v-toolbar-title>
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
                    <v-text-field v-model="editedItem.name" label="Project Title"></v-text-field>
                 
                  </v-row>
                   <v-row v-if="errors.name">
                   <span class="error--text">{{errors.name[0]}}</span>
                   </v-row>

                <v-row>
                <v-select v-model="editedItem.user_id" :items="users" item-value="id" item-text="name" label="User"></v-select>
                </v-row>

                <v-row>
                <v-select v-model="editedItem.client_id" :items="clients" item-value="id" item-text="client" label="Client"></v-select>
                </v-row>

                <v-row v-if="errors.client_id">
                <span class="error--text">The client field is required</span>
                </v-row>

                 <v-row>
                <v-select v-model="editedItem.status_id" :items="statuses" item-value="id" item-text="name" label="Status"></v-select>
                </v-row>

                <v-row v-if="errors.status_id">
                <span class="error--text">The status field is required</span>
                </v-row>
                
                <v-row>
                <v-textarea
                v-model="editedItem.comments"
                label="Default style"  
                ></v-textarea>
                </v-row>

                

                    
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
<!--     
      <template v-if="item.progress.progress"  v-slot:item.progress.progress="{ item }">
      <v-progress-linear
      v-model="item.progress.progress"
      height="20"
      >
      <strong>{{ item.progress.progress }}%</strong>
      </v-progress-linear>

      </template> -->

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
  

    data: () => ({
      model : 'project',
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
          text: 'Resource',
          align: 'left',
          sortable: false,
          value: 'user.name',
        },
         {
          text: 'Project',
          align: 'left',
          sortable: false,
          value: 'name',
        },
         {
          text: 'Client',
          align: 'left',
          sortable: false,
          value: 'client.client',
        },
         {
          text: 'Progress',
          align: 'left',
          sortable: false,
          value: 'progress.progress',
        },
         {
          text: 'Status',
          align: 'left',
          sortable: false,
          value: 'status.name',
        },
         {
          text: 'Comments',
          align: 'left',
          sortable: false,
          value: 'comments',
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
        name: '',
        user_id:'',
        client_id: '',
        status_id : '',
        comments : ''
       
      },
      defaultItem: {
        name: '',
        user_id:'',
        client_id: '',
        status_id : '',
        comments : ''
      
      },
      response : {
        msg:''
      },
      records:[],
      statuses:[], 
      users:[],
      clients:[],
        errors:[
          { name: '' },
          { client_id: '' },
          { status_id : '' },
          { comments : '' }
          ]
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
     const record = await this.$axios.get(this.model);
     this.records = record.data;

     const client = await this.$axios.get('client');
     this.clients = client.data;

     const status = await this.$axios.get('status');
     this.statuses = status.data;

    const user = await this.$axios.get('user');
     this.users = user.data;
            
    },

    methods: {

      editItem (item) {
          this.editedIndex = this.records.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.dialog = true
          
      },

      deleteItem (item) {
        confirm('Are you sure you want to delete this item?') && 
         this.$axios.delete(this.model + '/' + item.id)
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
            name: this.editedItem.name,
            client_id: this.editedItem.client_id,
            user_id: this.editedItem.user_id,
            status_id: this.editedItem.status_id,
            comments: this.editedItem.comments
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
            })
            .catch(error => console.log(error));
           }
           else{
              
            this.$axios.post(this.model,payload)
              .then((res) => {

              if(res.data.response_status){ 

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