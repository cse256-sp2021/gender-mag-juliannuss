// ---- Define your dialogs  and panels here ----
// let new_perm = define_new_effective_permissions('p');
// $('#sidepanel').append(new_perm);
// let new_user = define_new_user_select_field('c' , 'select button', function(selected_user){
//     $('#p').attr('username', selected_user)
// })
// $('#sidepanel').append(new_user);

// ---- Display file structure ----

let b = document.createElement('br');

let welcome = document.createElement('h1');
welcome.innerHTML = 'Welcome to this file permissions site'
let remove = document.createElement('h2');
remove.innerHTML = 'In order to edit permissions, click the lock button  next the file you want to edit '
let step1 = document.createElement('p');
step1.innerHTML = '1. After clicking the lock button, First select which employee or group you want to edit '
let step2 = document.createElement('p');
step2.innerHTML = '2. Then, Select which permissions you want to change NOTE: deny will override allow'
let override = document.createElement('h3')
override.innerHTML = 'IMPORTANT: Read_Execute will also select Read, Modify will also select Write, Full Control will also select all other permissions'
$('#sidepanel').append(welcome);
$('#sidepanel').append(b);
$('#sidepanel').append(remove);
$('#sidepanel').append(step1);
$('#sidepanel').append(step2);
$('#sidepanel').append(b);
$('#sidepanel').append(override);
// (recursively) makes and returns an html element (wrapped in a jquery object) for a given file object
function make_file_element(file_obj) {
    let file_hash = get_full_path(file_obj)

    if(file_obj.is_folder) {
        let folder_elem = $(`<div class='folder' id="${file_hash}_div">
            <h3 id="${file_hash}_header">
                <span class="oi oi-folder" id="${file_hash}_icon"/> ${file_obj.filename} 
                <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                    <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
                </button>
            </h3>
        </div>`)

        // append children, if any:
        if( file_hash in parent_to_children) {
            let container_elem = $("<div class='folder_contents'></div>")
            folder_elem.append(container_elem)
            for(child_file of parent_to_children[file_hash]) {
                let child_elem = make_file_element(child_file)
                container_elem.append(child_elem)
            }
        }
        return folder_elem
    }
    else {
        return $(`<div class='file'  id="${file_hash}_div">
            <span class="oi oi-file" id="${file_hash}_icon"/> ${file_obj.filename}
            <button class="ui-button ui-widget ui-corner-all permbutton" path="${file_hash}" id="${file_hash}_permbutton"> 
                <span class="oi oi-lock-unlocked" id="${file_hash}_permicon"/> 
            </button>
        </div>`)
    }
}

for(let root_file of root_files) {
    let file_elem = make_file_element(root_file)
    $( "#filestructure" ).append( file_elem);    
}



// make folder hierarchy into an accordion structure
$('.folder').accordion({
    collapsible: true,
    heightStyle: 'content'
}) // TODO: start collapsed and check whether read permission exists before expanding?


// -- Connect File Structure lock buttons to the permission dialog --

// open permissions dialog when a permission button is clicked
$('.permbutton').click( function( e ) {
    // Set the path and open dialog:
    let path = e.currentTarget.getAttribute('path');
    perm_dialog.attr('filepath', path)
    perm_dialog.dialog('open')
    //open_permissions_dialog(path)

    // Deal with the fact that folders try to collapse/expand when you click on their permissions button:
    e.stopPropagation() // don't propagate button click to element underneath it (e.g. folder accordion)
    // Emit a click for logging purposes:
    emitter.dispatchEvent(new CustomEvent('userEvent', { detail: new ClickEntry(ActionEnum.CLICK, (e.clientX + window.pageXOffset), (e.clientY + window.pageYOffset), e.target.id,new Date().getTime()) }))
});


// ---- Assign unique ids to everything that doesn't have an ID ----
$('#html-loc').find('*').uniqueId() 