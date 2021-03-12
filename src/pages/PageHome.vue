<template>
  <q-page>
    <div class="q-py-lg q-px-md  ">
      <q-input 
        bottom-slots
        v-model="newQweetContent"
        class="new-qweet"
        label="What s happening?"
        counter
        maxlength="280"
        autogrow
      >
          <template v-slot:before>
            <q-avatar size="xl">
              <img src="https://i.pinimg.com/736x/06/b2/32/06b232665f2c2f8aaca7aad013b06fa1.jpg">
            </q-avatar>
          </template>

          <!-- <template v-slot:append>
            <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
            <q-icon name="schedule" />
          </template> -->

          <template v-slot:hint>
            Field hint
          </template>

          <template v-slot:after>
            <!-- <q-btn round dense flat icon="send" /> -->
            <q-btn
              @click="addNewQweet"
              :disable="!newQweetContent"
              color="primary"
              label="Qweet"
              rounded
              unelevated
              no-caps
            >

            </q-btn>
          </template>
        </q-input>
      </div>
      <q-separator class="divider" size="10px" color="grey-2"/>

      <q-list separator>

        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >

        <q-item 
          v-for="qweet in qweets"
          :key="qweet.id"
          class="qweet q-py-md"   
        >
          <q-item-section avatar top >
            <q-avatar size="xl">
              <img src="https://i.pinimg.com/736x/06/b2/32/06b232665f2c2f8aaca7aad013b06fa1.jpg">
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label>
              <strong>Randy Orton</strong>
              <span class="text-grey-7"> 
                @randy_rko
              </span>
            </q-item-label>
            <q-item-label  class="qweet-content">
               {{qweet.content}}
            </q-item-label>
            <div class="qweet-icons row justify-between">
              <q-btn
               color="grey"
               icon="far fa-comment"
               size="sm"
               flat
               round
              >
              </q-btn>
              <q-btn
               color="grey"
               icon="fas fa-retweet"
               size="sm"
               flat
               round
              >
              </q-btn>
              <q-btn
               @click="toggledLiked(qweet)"
               :color="qweet.like ? 'pink' : 'grey'"
               :icon ="qweet.like ? 'fas fa-heart' : 'far fa-heart'"
               size="sm"
               flat
               round
              >
              </q-btn>
              <q-btn
               @click="deleteQweet(qweet)"
               color="grey"
               icon="fas fa-trash"
               size="sm"
               flat
               round
              >
              </q-btn>
            </div>
          </q-item-section>
          

          <q-item-section side top>
           {{ qweet.date | relativeDate }}
           <!-- {{ qweet.date }} -->
          </q-item-section>
        </q-item>
        </transition-group>
    </q-list>
  </q-page>
</template>

<script>
import { formatDistance} from 'date-fns'
import db from 'src/boot/firebase'

export default {
  name: 'PageHome',
  data() {
    return {
      newQweetContent:'',
      qweets:[
        // {
        //   id: "ID1",
        //   content:'Lorem Ipdfsfsfsdafsadsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar' 
        //   +'de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y' 
        //   +'los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relle'
        //   +' y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
        //   date: 1615482401847,
        //   like: false

        // },
        // {
        //   id: "ID2",
        //   content:'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto. Lorem Ipsum ha sido el texto de relleno estándar' 
        //   +'de las industrias desde el año 1500, cuando un impresor (N. del T. persona que se dedica a la imprenta) desconocido usó una galería de textos y' 
        //   +'los mezcló de tal manera que logró hacer un libro de textos especimen. No sólo sobrevivió 500 años, sino que tambien ingresó como texto de relle'
        //   +' y más recientemente con software de autoedición, como por ejemplo Aldus PageMaker, el cual incluye versiones de Lorem Ipsum.',
        //   date: 1615489943418,
        //   like: true

        // }
      ]
    }
  },
  methods:{
    addNewQweet(){
      console.log("ddd")
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        like: false

      }
      db.collection("qweets").add(newQweet).then(function(docRef)  {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });

      // this.qweets.push(newQweet)
      this.newQweetContent='';
    },
    deleteQweet(qweet){
     console.log('delete qweet:',qweet);
    //  let dateToDelete = qweet.date
    //  let index = this.qweets.findIndex(qweet => qweet.date === dateToDelete)
    //  this.qweets.splice(index,1)

     db.collection('qweets').doc(qweet.id).delete().then(function() {
     console.log("Document successfully deleted!");
      }).catch((error) => {
          console.error("Error removing document: ", error);
      })
    },
    toggledLiked(qweet){
      console.log("like");
      // Set the "capital" field of the city 'DC'
      db.collection("qweets").doc(qweet.id).update({
          like: !qweet.like
      })
      .then(() => {
          console.log("Document successfully updated!")
      })
      .catch((error) => {
          // The document probably doesn't exist.
          console.error("Error updating document: ", error)
      })
    } 
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date())
    }
  },
  mounted(){
    db.collection('qweets').orderBy('date').onSnapshot(snapshot => {
        snapshot.docChanges().forEach( change =>{
          let qweetChange = change.doc.data()
          qweetChange.id = change.doc.id
            if (change.type === 'added') {
                console.log('New qweet: ' , qweetChange);
                this.qweets.unshift(qweetChange)
            }
            if (change.type === "modified") {
                console.log("Modified qweet: ", qweetChange);
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                Object.assign(this.qweets[index], qweetChange)
            }
            if (change.type === "removed") {
                console.log("Removed qweet: ", qweetChange);
                let index = this.qweets.findIndex(qweet => qweet.id === qweetChange.id)
                this.qweets.splice(index,1)
            }
        })
    })
  }
}
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4  !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid 
  border-color: $grey-5
.qweet-content
  white-space: pre-line
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-icons 
  margin-left: -5px
</style>
