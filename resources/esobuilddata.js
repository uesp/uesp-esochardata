var ecdLastTooltip = null;


function onTooltipHoverShow()
{
	ecdLastTooltip = $(this).find('.ecdTooltip');
	
	if (ecdLastTooltip) 
	{
		ecdLastTooltip.css('display', 'inline-block');
		adjustSkillTooltipPosition(ecdLastTooltip, $(this));
	}
}


function adjustSkillTooltipPosition(tooltip, parent)
{
     var windowWidth = $(window).width();
     var windowHeight = $(window).height();
     var toolTipWidth = tooltip.width();
     var toolTipHeight = tooltip.height();
     var elementHeight = parent.height();
     var elementWidth = parent.width();
     
     var top = parent.offset().top - 50;
     var left = parent.offset().left + parent.outerWidth() + 3;
     
     tooltip.offset({ top: top, left: left });
     
     var viewportTooltip = tooltip[0].getBoundingClientRect();
     
     if (viewportTooltip.bottom > windowHeight) 
     {
    	 var deltaHeight = viewportTooltip.bottom - windowHeight + 10;
         top = top - deltaHeight
     }
     else if (viewportTooltip.top < 0)
     {
    	 var deltaHeight = viewportTooltip.top - 10;
         top = top - deltaHeight
     }
         
     if (viewportTooltip.right > windowWidth) 
     {
         left = left - toolTipWidth - parent.width() - 28;
     }
     
     tooltip.offset({ top: top, left: left });    
}


function onTooltipHoverHide()
{
	if (ecdLastTooltip) ecdLastTooltip.hide();
}


function onTooltipMouseMove(e)
{
	if (ecdLastTooltip == null) return;
	
    var mousex = e.pageX + 20;
    var mousey = e.pageY + 20 
    
    var tipWidth  = ecdLastTooltip.width();
    var tipHeight = ecdLastTooltip.height();

    var tipVisX = $(window).width() - (mousex + tipWidth);
    var tipVisY = $(window).height() - (mousey + tipHeight);

    if ( tipVisX < 20 ) {
        mousex = e.pageX - tipWidth - 20;
    } if ( tipVisY < 20 ) {
        mousey = e.pageY - tipHeight - 20;
    }
    
    ecdLastTooltip.css({  top: mousey, left: mousex });
}


function onDocReady() 
{  
	$(".ecdTooltipTrigger").hover(onTooltipHoverShow, onTooltipHoverHide, onTooltipMouseMove);
	$(".ecdTooltip").hover(onTooltipHoverHide, onTooltipHoverHide, onTooltipHoverHide);
	
	$('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
	
	$('.ecdSkillTreeName1').click(OnEsoSkillTreeName1Click);
	$('.ecdSkillTreeName2').click(OnEsoSkillTreeName2Click);
	
	EsoSkillTree_LastOpenTreeName = $('.ecdSkillTreeName1:visible').first();
	EsoSkillTree_LastOpenTree = $('.ecdSkillTreeContent1:visible').first();
	
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
	
	var tables = $(".tablesorter");
	
	if (tables.tablesorter)
	{
		$(".tablesorter").tablesorter({
				sortList: [[2,0]] 
			});
	}
	
	$(".ecdItemFilterTextInput").keyup(function() {
			$(".ecdItemFilterTextInput").val(this.value);
			DoItemFilter();
		});
	
	$(".ecdItemFilterTextInput").blur(function() {
			$(".ecdItemFilterTextInput").val(this.value);
		});
		
}


var EsoSkillTree_LastOpenTree = null;
var EsoSkillTree_LastOpenTreeName = null;
var EsoSkillTree_LastSkillContentName = null;
var EsoSkillTree_LastSkillContent = null;


function OnEsoSkillTreeName1Click(e)
{
	
	if (EsoSkillTree_LastOpenTree != null)
	{
		if (EsoSkillTree_LastOpenTree.is($(this).next(".ecdSkillTreeContent1"))) return;
		EsoSkillTree_LastOpenTree.slideUp();
		EsoSkillTree_LastOpenTreeName.removeClass('ecdSkillTreeNameHighlight');
		EsoSkillTree_LastOpenTree = null;
		EsoSkillTree_LastOpenTreeName = null;
	}
	
	EsoSkillTree_LastOpenTreeName = $(this);
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	EsoSkillTree_LastOpenTreeName.addClass('ecdSkillTreeNameHighlight');
	EsoSkillTree_LastOpenTree.slideDown();

	SelectEsoSkillTreeContents(EsoSkillTree_LastOpenTree.children(".ecdSkillTreeName2").first());
}


function OnEsoSkillTreeName2Click(e)
{
	SelectEsoSkillTreeContents($(this));
}


function SelectEsoSkillTreeContents(object)
{
	if (EsoSkillTree_LastSkillContentName != null)
	{
		EsoSkillTree_LastSkillContentName.removeClass('ecdSkillTreeNameHighlight2');
		EsoSkillTree_LastSkillContentName = null;
	}
	
	if (EsoSkillTree_LastSkillContent != null)
	{
		EsoSkillTree_LastSkillContent.hide();
		EsoSkillTree_LastSkillContent = null;
	}
	
	EsoSkillTree_LastSkillContentName = object;
	object.addClass('ecdSkillTreeNameHighlight2');
	
	var objText = object.contents().filter(function(){ return this.nodeType == 3;})[0].nodeValue;
	
	var idName = 'ecdSkill_' + objText.replace(" ", "").replace("'", "");
	EsoSkillTree_LastSkillContent = $('#'+idName); 
	EsoSkillTree_LastSkillContent.show(); 
}


function OnEsoRightTitleClick(name)
{
	$('.ecdRightTitleButtonEnabled').addClass("ecdRightTitleButtonDisabled").removeClass("ecdRightTitleButtonEnabled");
	
	var idName = "#ecd" + name;
	var idButtonName = "#ecd" + name + "Button";
	$(idButtonName).removeClass("ecdRightTitleButtonDisabled").addClass("ecdRightTitleButtonEnabled");
	
	$("#ecdSkills").hide();
	$("#ecdInventory").hide();
	$("#ecdBank").hide();
	$("#ecdAccountInv").hide();
	
	$(idName).show();
}


function OnItemFilter(name)
{
	$('.ecdItemFilterContainer').removeClass("selected");
	
	var idName = ".ecdItemFilter" + name;
	$(idName).addClass("selected");
	
	var displayName = name.toUpperCase();
	
	if (displayName == "ARMOR")
		displayName = "APPAREL";
	else if (displayName == "MATERIAL")
		displayName = "MATERIALS";	
	else if (displayName == "MISC")
		displayName = "MISC";
	
	$(".ecdItemFilterTextLabel").text(displayName);
	
	DoItemFilter();
}


function ItemFilter_All(item)
{
	return true;
}


function ItemFilter_Armor(item)
{
	return item.type == 2 || (item.type == 1 && item.weaponType == 14);
}


function ItemFilter_Weapon(item)
{
	return item.type == 1 && item.weaponType != 14;
}


function ItemFilter_Consumable(item)
{
	return item.consumable != 0 && (
		item.type ==  7 || item.type ==  4 || item.type ==  9 || item.type == 12 || item.type == 29 || item.type == 55 || 
		item.type == 57 || item.type == 30 || item.type == 18 || item.type ==  5 || item.type == 47 || item.type ==  6 ||
		item.type == 18 || item.type ==  8 || item.type == 54);
}


function ItemFilter_Material(item)
{
	return item.type == 10 || item.type == 44 || item.type == 53 || item.type == 45 || item.type == 33 || item.type == 31 || 
           item.type == 39 || item.type == 37 || item.type == 35 || item.type == 38 || item.type == 40 || item.type == 52 ||
           item.type == 36 || item.type == 51 || item.type == 17 || item.type == 42 || item.type == 46 || item.type == 41;
}


function ItemFilter_Misc(item)
{
	return item.type == 56 || item.type == 48 || item.type == 19 || item.type == 9 || item.type == 29 || item.type == 55 || 
           item.type == 57 || item.type == 30 || item.type == 18 || item.type == 5 || item.type == 47 || item.type == 6;
}


function ItemFilter_Quest(item)
{
	//TODO
	return false;
}


function ItemFilter_Junk(item)
{
	return item.junk != 0;
}


var ITEM_FILTER_FUNCTIONS = {
		"ALL" 			: ItemFilter_All,
		"WEAPON" 		: ItemFilter_Weapon,
		"ARMOR" 		: ItemFilter_Armor,
		"CONSUMABLE" 	: ItemFilter_Consumable,
		"MATERIAL" 		: ItemFilter_Material,
		"MISC" 			: ItemFilter_Misc,
		"QUEST" 		: ItemFilter_Quest,
		"JUNK" 			: ItemFilter_Junk,
}


function DoItemFilter()
{
	var filterName = $(".ecdItemFilterContainer.selected").attr('itemfilter').toUpperCase();
	var filterText = $(".ecdItemFilterTextInput").val().toLowerCase();
	var filterFunc = ITEM_FILTER_FUNCTIONS[filterName];
	
	if (filterFunc == null) filterFunc = ItemFilter_All;
	
	$(".ecdScrollContent tr").each(function() {
			var localId = $(this).attr('localid');
			var item = ecdAllInventory[localId];
			
			if (item == null)
			{
				$(this).show();
				return;
			}
			
			if (!filterFunc(item)) {
				$(this).hide();
				return;
			}
			
			if (filterText != "" && item.nameLC.indexOf(filterText) == -1)
			{
				$(this).hide();
				return;
			}
				
			$(this).show();
		});	
	
}


$(document).ready(onDocReady);
