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
let step3 = document.createElement('p');
let step4 = document.createElement('p');
let step5 = document.createElement('p');
step3.innerHTML = "Read_Execute will also select Read"
step4.innerHTML = "Modify will also select Write"
step5.innerHTML = "Full Control will also select all other permissions"
override.innerHTML = 'IMPORTANT: '
let newperm = document.createElement('h2');
newperm.innerHTML = "In order to add new permissons, first click on the lock icon, and then hit the 'Add' button under the username section";
let trouble = document.createElement('h3')
trouble.innerHTML = "Having trouble with some files being inaccesable in the Lecture_Notes folder? check the file titled 'Lecture3.txt' and add user options using the add button";
let trouble2 = document.createElement('h3')
trouble2.innerHTML = "Having trouble with teacher_assistant not being able to modify 'Lecture4.txt'? click the lock button next to this file and unclick the deny modify checkmark for the group students. "
let trouble3 = document.createElement('h3');
trouble3.innerHTML = "Want to change permissions for a specific person in a group? click the advanced button after clicking the lock icon and then hit edit to select which user you want to change"
$('#sidepanel').append(welcome);
$('#sidepanel').append(b);
$('#sidepanel').append(remove);
$('#sidepanel').append(step1);
$('#sidepanel').append(step2);
$('#sidepanel').append(b);
$('#sidepanel').append(newperm);
$('#sidepanel').append(override);
$('#sidepanel').append(step3);
$('#sidepanel').append(step4);
$('#sidepanel').append(step5);
$('#sidepanel').append(b);



$('#sidepanel').append(trouble);
$('#sidepanel').append(b);
$('#sidepanel').append(trouble2);
$('#sidepanel').append(b);
$('#sidepanel').append(trouble3);
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