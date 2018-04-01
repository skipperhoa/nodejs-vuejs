<template>
	<div>
		
			<div class="row">
				<div class="col-md-6">
					<h1>Create An Item</h1>
					 <form v-on:submit.prevent="addItem">
					 	<div class="form-group">
							<label>Ma Item:</label>
							<input type="text"  class="form-control" v-model="item.masp"/>
						</div>
						<div class="form-group">
							<label>Item Name:</label>
							<input type="text"  class="form-control" v-model="item.name"/>
						</div>
						<div class="form-group">
							<label>Item price:</label>
							<input type="text" class="form-control col-md-6" v-model="item.price">		

						</div>
						<div class="form-group">
							<label>Item image:</label>
							<input @change="uploadImage" type="file" name="image" accept="image/*">	
						    <img :src="imageSrc" class="image">
						</div>
						<div class="form-group">
				          <button class="btn btn-primary">Add Item</button>
				        </div>
				    </form>
				      <button class="btn btn-success" v-on:click="updateItem">Update Item</button>
				</div>
				<div class="col-md-6">
					
							<h1>Danh sach Item</h1>
							<table class="table">
								<thead>
									<tr>
										<th>Ma</th>
										<th>Name</th>
										<th>Price</th>
										<th>Image</th>
										<th>Edit</th>
										<th>Delete</th>
									</tr>
		
								</thead>
								<tbody>
										<tr v-for="(sp,index) in dulieu[0]" v-if="sp !== null" >
											<td>{{sp.masp}}</td>
											<td>{{sp.name}}</td>
											<td>{{sp.price}}</td>
											<td><img :src="sp.image" class="class_img" /></td>
											<td><span class="badge badge-info" v-on:click="editItem(index)">Edit</span></td>
											<td><span class="badge badge-danger" v-on:click="deleteItem(index)">Delete</span></td>
										</tr>
								</tbody>
							</table>
					
					
				</div>
			</div>
		
		<div class="row">
			<div class="col-md-6">
				<!-- <router-link :to="{name:'UploadImage'}">Upload Image</router-link> -->
			</div>
		</div>

	</div>

</template>
<style>
	.image{
		width:150px;
		height: 150px;
	}
	.class_img{
		width:80px;
		height: 100px;
	}
</style>
<script>
	export default{
		data(){
			return {
				item:{},
				dulieu:[],
				imageSrc: 'http://hoanguyenit.com/public/img/logo33.png',
			}
		},
		created:function(){
			this.getItems();
		},
		methods:{
			addItem(){
				this.axios.post("http://localhost:8888/add",this.item).then((response) => {
					   console.log(response);
					   this.dulieu[0].push({
						   "masp":this.item.masp,
						   "name":this.item.name,
						   "price":this.item.price,
						   "image":"uploads/"+this.item.image
					   })
				  });
				  
			},
			editItem(index){
				//console.log(this.dulieu[0][index]);
				var data_edit = this.dulieu[0][index];//lấy dữ liệu cần edit
				this.item=data_edit;//đưa dữ liệu vào item
				this.imageSrc = this.item.image;//gắn image lại
			},
			updateItem(){
				
				this.axios.post("http://localhost:8888/update",this.item).then((response) => {
					var image = this.item.image.replace('uploads/', '');
					console.log(image);
					var index = response.data['vitri'];
					this.dulieu[0][index].masp=this.item.masp;
					this.dulieu[0][index].name=this.item.name;
					this.dulieu[0][index].price=this.item.price;
					this.dulieu[0][index].image="uploads/"+image;
					
					this.item={};
					// console.log(this.dulieu[0][index].image="uploads/"+this.item.image);
					 console.log(this.dulieu[0]);
					
             	 });
			},
			deleteItem(index){
				
				var masp = this.dulieu[0][index].masp;
				//console.log(masp);
				this.axios.get("http://localhost:8888/delete/"+masp).then((response)=>{
					console.log(response.data);
					this.dulieu[0].splice(index, 1);
				});
			},
			getItems(){
				
				this.axios.get("http://localhost:8888/getItems").then((response) => {
					this.dulieu.push(response.data); 
					console.log(this.dulieu);
             	});
			},
			uploadImage: function(e) {
			      var files = e.target.files;
			      this.item.image = files[0].name;
			    
			      if(!files[0]) {
			        return;
			      }
			     var data = new FormData();
				  data.append('image', files[0]);
				      var reader = new FileReader();
				      reader.onload = (e) => {
				        this.imageSrc = e.target.result;
				      };
				      this.axios.post('http://localhost:8888/uploads', data, {headers: { 'Content-Type': 'multipart/form-data' } }).then(function (response) {
						reader.readAsDataURL(files[0]);
				      }).catch(function (error) {
				        console.log(error) // catch your error
				      });
			      reader.readAsDataURL(files[0]);
			}
		}
	}

</script>