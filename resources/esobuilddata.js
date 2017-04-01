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
	if (tooltip == null || tooltip[0] == null) return;
	
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


var EsoSkillTree_LastOpenTree = null;
var EsoSkillTree_LastOpenTreeName = null;
var EsoSkillTree_LastSkillContentName = null;
var EsoSkillTree_LastSkillContent = null;

var EsoAchTree_LastOpenTree = null;
var EsoAchTree_LastOpenTreeName = null;
var EsoAchTree_LastContentName = null;
var EsoAchTree_LastContent = null;


function OnEsoSkillTreeName1Click(e)
{
	EsoSkillTree_LastOpenTreeName = $('.ecdSkillTreeName1.ecdSkillTreeNameHighlight').first();
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	if (EsoSkillTree_LastOpenTree.is($(this).next(".ecdSkillTreeContent1"))) return;
	EsoSkillTree_LastOpenTree.slideUp();
	EsoSkillTree_LastOpenTreeName.removeClass('ecdSkillTreeNameHighlight');
		
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
	EsoSkillTree_LastSkillContentName.removeClass('ecdSkillTreeNameHighlight2');
	EsoSkillTree_LastSkillContent.hide();
		
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
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
	
	EsoSkillTree_LastSkillContentName.removeClass('ecdSkillTreeNameHighlight2');
	EsoSkillTree_LastSkillContent.hide();
	
	EsoSkillTree_LastSkillContentName = object;
	object.addClass('ecdSkillTreeNameHighlight2');
	
	var objText = object.contents().filter(function(){ return this.nodeType == 3;})[0].nodeValue;
	var idName = 'ecdSkill_' + objText.replace(/ /g, "").replace(/'/g, "");
	
	EsoSkillTree_LastSkillContent = $('#'+idName); 
	EsoSkillTree_LastSkillContent.show(); 
}


function OnEsoAchievementTreeName1Click(e)
{
	EsoAchTree_LastOpenTreeName = $('.ecdAchTreeName1.ecdAchTreeNameHighlight').first();
	EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
	if (EsoAchTree_LastOpenTree.is($(this).next(".ecdAchTreeContent1"))) return;
	
	EsoAchTree_LastOpenTree.slideUp();
	EsoAchTree_LastOpenTreeName.removeClass('ecdAchTreeNameHighlight');
		
	EsoAchTree_LastContentName = $('.ecdAchTreeNameHighlight2').first();
	EsoAchTree_LastContentName.removeClass('ecdAchTreeNameHighlight2');
	EsoAchTree_LastContent = $('.ecdAchData:visible').first();
	EsoAchTree_LastContent.hide();
		
	EsoAchTree_LastOpenTreeName = $(this);
	EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
	EsoAchTree_LastOpenTreeName.addClass('ecdAchTreeNameHighlight');
	EsoAchTree_LastOpenTree.slideDown();

	SelectEsoAchievementTreeContents(EsoAchTree_LastOpenTree.children(".ecdAchTreeName2").first());
}


function OnEsoAchievementTreeName2Click(e)
{
	SelectEsoAchievementTreeContents($(this));
}


function SelectEsoAchievementTreeContents(object)
{
	EsoAchTree_LastContentName = $('.ecdAchTreeNameHighlight2').first();
	EsoAchTree_LastContent = $('.ecdAchData:visible').first();
	
	EsoAchTree_LastContentName.removeClass('ecdAchTreeNameHighlight2');
	EsoAchTree_LastContent.hide();
	
	EsoAchTree_LastContentName = object;
	object.addClass('ecdAchTreeNameHighlight2');
	
	var catName = EsoAchTree_LastOpenTreeName.attr("achcategory");
	var subCatName = EsoAchTree_LastContentName.attr("achsubcategory");
	
	var idName = "ecdAch_" + catName + "_" + subCatName;
	if (subCatName == null || subCatName == "") idName = "ecdAch_" + catName;
	
	idName = idName.replace(/ /g, "").replace(/'/g, "");
	
	EsoAchTree_LastContent = $('#'+idName); 
	EsoAchTree_LastContent.show(); 
}


function OnEsoRightTitleClick(name)
{
	$('.ecdRightTitleButtonEnabled').addClass("ecdRightTitleButtonDisabled").removeClass("ecdRightTitleButtonEnabled");
	
	var idName = "#ecd" + name;
	var idButtonName = "#ecd" + name + "Button";
	$(idButtonName).removeClass("ecdRightTitleButtonDisabled").addClass("ecdRightTitleButtonEnabled");
	
	$(".ecdRightDataArea").hide();
	//$("#ecdSkills").hide();
	//$("#ecdInventory").hide();
	//$("#ecdBank").hide();
	//$("#ecdCraft").hide();
	//$("#ecdAccountInv").hide();
	//$("#ecdAchievements").hide();
	
	$(idName).show();
	
	UpdateEsoInventoryShownSpace();
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
		item.type == 18 || item.type ==  8 || item.type == 54 || item.type == 58);
}


function ItemFilter_Material(item)
{
	return item.type == 10 || item.type == 44 || item.type == 53 || item.type == 45 || item.type == 33 || item.type == 31 || 
           item.type == 39 || item.type == 37 || item.type == 35 || item.type == 38 || item.type == 40 || item.type == 52 ||
           item.type == 36 || item.type == 51 || item.type == 17 || item.type == 42 || item.type == 46 || item.type == 41 ||
           item.type == 17 || item.type == 43;
}


function ItemFilter_Misc(item)
{
	return item.type == 56 || item.type == 48 || item.type == 19 || item.type == 9 || item.type == 29 || item.type == 55 || 
           item.type == 57 || item.type == 30 || item.type == 18 || item.type == 5 || item.type == 47 || item.type ==  6 ||
           item.type == 26 || item.type == 21 || item.type == 20;
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


function MatchFilterString(filterText, item)
{
	if (filterText == "") return true;
	
	if (item.nameLC.indexOf(filterText) != -1) return true;
	if (item.setNameLC.indexOf(filterText) != -1) return true;
	
	return false;	
}


var g_EsoCharLastItemFilter = "";
var ESO_ITEMFILTER_UPDATEMS = 250;
var g_EsoItemFilterIsUpdating = false;


function DoItemFilter()
{
	var filterName = $(".ecdItemFilterContainer.selected").attr('itemfilter').toUpperCase();
	var filterText = $(".ecdItemFilterTextInput:visible").val().toLowerCase();
	var filterFunc = ITEM_FILTER_FUNCTIONS[filterName];
	
	g_EsoItemFilterIsUpdating = false;
	if (filterFunc == null) filterFunc = ItemFilter_All;
	
	if (filterText == g_EsoCharLastItemFilter) return;
	g_EsoCharLastItemFilter = filterText;
	
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
			
			if (!MatchFilterString(filterText, item))
			{
				$(this).hide();
				return;
			}
				
			$(this).show();
		});	
	
	UpdateEsoInventoryShownSpace();
}


function UpdateItemFilter()
{
	
	if (!g_EsoItemFilterIsUpdating)
	{
		g_EsoItemFilterIsUpdating = true;
		setTimeout(DoItemFilter, ESO_ITEMFILTER_UPDATEMS);
	}
}


function copyToClipboard(self)
{
	var textToCopy = $(self).text();
	copyTextToClipboard(textToCopy);
}


function OnBuildTableAnchorClick(e)
{
	e.stopPropagation();
}


function OnBuildTableRowClick(e)
{
	var anchor = $(this).parent().find(".ecdBuildLink");
	if (anchor.length == 0) return;
	
	window.location.href = anchor.attr("href");
}


function copyTextToClipboard(textToCopy)
{
	$("body")
		.append($('<input type="text" name="fname" class="textToCopyInput" style="opacity: 0; position: absolute;" />' )
				.val(textToCopy))
		.find(".textToCopyInput")
		.select();
	
	try 
	{
		var successful = document.execCommand('copy');
		var msg = successful ? 'successful' : 'unsuccessful';
    }
	catch (err) 
    {
    	window.prompt("To copy the text to clipboard: Ctrl+C, Enter", textToCopy);
    }
	
	$(".textToCopyInput").remove();
}


function ActivateBuildActionBar(barIndex)
{
	
	if (barIndex >= 1 && barIndex <= 4)
	{
		var activeBar = $(".ecdActionBar" + barIndex);
		var weaponBarIndex = activeBar.attr("activeweaponbar");
		
		$("#ecdActionBar .ecdActiveAbilityBar").removeClass("ecdActiveAbilityBar");
		activeBar.addClass("ecdActiveAbilityBar");
		
		if (weaponBarIndex >= 1 && weaponBarIndex <= 2)
		{
			$("#ecdEquipSlots .ecdActiveAbilityBar").removeClass("ecdActiveAbilityBar");
			$("#ecdWeaponBar" + weaponBarIndex).addClass("ecdActiveAbilityBar");
		}
		
		$(".ecdStatBar").hide();
		$(".ecdStatBar1").hide();
		$(".ecdStatBar2").hide();
		$(".ecdStatBar3").hide();
		$(".ecdStatBar4").hide();
		
		$(".ecdStatBar" + barIndex).show();
	}
	
	if (barIndex >= 1 && barIndex <= 2)
	{
		$("#ecdEquipSlots .ecdActiveAbilityBar").removeClass("ecdActiveAbilityBar");
		$("#ecdWeaponBar" + barIndex).addClass("ecdActiveAbilityBar");
	}
	
}


function OnBuildWeaponBar1Click(e)
{
	ActivateBuildActionBar(1);
}


function OnBuildWeaponBar2Click(e)
{
	ActivateBuildActionBar(2);
}


function OnBuildActionBar1Click(e)
{
	ActivateBuildActionBar(1);
}


function OnBuildActionBar2Click(e)
{
	ActivateBuildActionBar(2);
}


function OnBuildActionBar3Click(e)
{
	ActivateBuildActionBar(3);
}


function OnBuildActionBar4Click(e)
{
	ActivateBuildActionBar(4);
}


var ecdItemOwnerWindow = null;


function CreateItemOwnerWindow()
{
	if (ecdItemOwnerWindow != null) return;
	
	ecdItemOwnerWindow = $("<div/>")
							.addClass("ecdItemOwnerWindow")
							.attr('id', 'ecdItemOwnerWindow')
							.hide()
							.appendTo("body");
	
	ecdItemOwnerWindow.html("<div class='ecdItemOwnerTitle'>Characters With Item</div><hr><div id='ecdItemOwnerData' class='ecdItemOwnerData'></div>");
}


function CreateItemOwnerHtml(itemData)
{
	var output = "";
	var summaryData = {};
	
	for (var i = 0; i < itemData.characterIds.length; ++i)
	{
		var qnt = itemData.characterQnts[i];
		var charId = itemData.characterIds[i];
		
		if (summaryData[charId] == null)
			summaryData[charId] = qnt;
		else
			summaryData[charId] += qnt;
	}
	
	for (var charId in summaryData) 
	{
		var qnt = summaryData[charId];
		
		var name = ecdCharacterNames[charId];
		if (name == null) name = "" + charId;
		
		output += "<div class='ecdItemDataQnt'>" + qnt + "</div>";
		output += "<div class='ecdItemDataName'>" + name + "</div>";
		output += "<br/>\n";
	}
	
	return output;
}


function ShowItemOwnerWindow(element, itemData)
{
	CreateItemOwnerWindow();
	
	ecdItemOwnerWindow.find('#ecdItemOwnerData').html(CreateItemOwnerHtml(itemData));
	ecdItemOwnerWindow.show();
	
	var top = element.offset().top + 30;
    var left = element.offset().left + 100;
    
    ecdItemOwnerWindow.offset({ top: top, left: left });
}


function OnItemRowClick(e)
{
	
	var localId = $(this).attr("localid");
	if (localId == null) return;
	
	var itemData = ecdAllInventory[localId];
	if (itemData == null) return;
	
	ShowItemOwnerWindow($(this), itemData);
}


function OnItemRowLeave(e)
{
	if (ecdItemOwnerWindow) ecdItemOwnerWindow.hide();
}


function DoesEsoItemLinkHaveEvent()
{
	if (ShowEsoItemLinkPopup != null) return true; 
	
	//var events = $._data($(".eso_item_link").get(0), 'events');
	//if (events['mouseover'] != null || events['mouseout'] != null) return true;
	
	return false;
}


function OnSlideAchievementComplete()
{
	SlideAchievementIntoView($(this).parent());
}


function SlideAchievementIntoView(element, instant)
{
	var offsetTop = element.position().top;
	var parent = element.parent(".ecdAchData");
	var nextAch = element.next(".ecdAchievement1");
	var nextTop = offsetTop + element.height() + 25;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


function OnAchievementClick()
{
	var dataBlock = $(this).children(".ecdAchDataBlock");
	dataBlock.slideToggle(400, OnSlideAchievementComplete);
	
	if (dataBlock.length == 0) SlideAchievementIntoView($(this));
}


var lastAchSearchText = "";
var lastAchSearchPos = -1;
var lastAchSearchElement = null;


function OnFindEsoCharAchievement(element)
{
	var text = $("#ecdFindAchInput").val().trim().toLowerCase();
	if (text == "") return;
	
	if (text != lastAchSearchText)
	{
		lastAchSearchText = text;
		lastAchSearchPos = -1;
		lastAchSearchElement = null;
	}
	
	FindEsoCharNextAchievement();
}


function FindEsoCharNextAchievement()
{
	var isFound = false;
	
	$(".ecdAchSearchHighlight").removeClass("ecdAchSearchHighlight");
		
	$(".ecdAchName, .ecdAchDesc, .ecdAchReward, .ecdAchListItem img").each(function(index) {
		if (index <= lastAchSearchPos) return true;
		var $this = $(this);
		var text = $this.text().toLowerCase();
		var title = $this.attr("title");
		if (title == null) title = "";
		title = title.toLowerCase();
		
		lastAchSearchPos = index;
		
		if (text.indexOf(lastAchSearchText) >= 0 || title.indexOf(lastAchSearchText) >= 0) 
		{
			var achievement = $this.closest(".ecdAchievement1");
			if (lastAchSearchElement != null && achievement.is(lastAchSearchElement)) return true;
			
			lastAchSearchElement = achievement;
			SelectFoundAchievement($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastAchSearchText = "";
		lastAchSearchPos = -1;
		lastAchSearchElement = null;
		$(".ecdFindAchTextBox button").text("Done!");
	}
	else
	{
		$(".ecdFindAchTextBox button").text("Find Next");
	}
}


function SelectFoundAchievement(element)
{
	var achievement = $(element).closest(".ecdAchievement1");
	var parent = $(element).closest(".ecdAchData");
	var parentId = parent.attr("id");
	var catData = parentId.split("_");
	var catName = catData[1];
	var subCatName = catData[2];
	var currentCat = $(".ecdAchTreeNameHighlight").attr("achcategory");
	var currentSubCat = $(".ecdAchTreeNameHighlight2").attr("achsubcategory");
	
	if (currentCat != catName)
	{
		$(".ecdAchTreeContent1:visible").slideUp();
		$(".ecdAchTreeNameHighlight").removeClass("ecdAchTreeNameHighlight");
		
		EsoAchTree_LastOpenTreeName = $(".ecdAchTreeName1[achcategory='" + catName + "']");
		EsoAchTree_LastOpenTreeName.addClass("ecdAchTreeNameHighlight");
		
		EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
		EsoAchTree_LastOpenTree.slideDown();

		currentSubCat = "";
	}
	
	if (currentSubCat != subCatName)
	{
		$(".ecdAchTreeNameHighlight2").removeClass("ecdAchTreeNameHighlight2");
		
		EsoAchTree_LastOpenTreeName = $(".ecdAchTreeNameHighlight");
		EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
		
		EsoAchTree_LastContentName = $(".ecdAchTreeName2[achsubcategory='" + subCatName + "']");
		EsoAchTree_LastContentName.addClass('ecdAchTreeNameHighlight2');
	}
	
	$(".ecdAchData:visible").hide();
	EsoAchTree_LastContent = parent;
	parent.show();
	
	achievement.addClass("ecdAchSearchHighlight");
	var dataBlock = achievement.children(".ecdAchDataBlock");
	if (dataBlock.length > 0) dataBlock.slideDown(0, OnSlideAchievementComplete);
	
	SlideAchievementIntoView(achievement, true);
}


var lastRecipeSearchText = "";
var lastRecipeSearchPos = -1;
var lastRecipeSearchElement = null;


function OnEsoCharDataSearchRecipe(event)
{
	var searchText = $("#ecdSkillRecipesSearchInput").val().trim().toLowerCase();
	if (searchText == "") return;
	
	if (searchText != lastRecipeSearchText)
	{
		lastRecipeSearchText = searchText;
		lastRecipeSearchPos = -1;
		lastRecipeSearchElement = null;
	}
	
	FindEsoCharNextRecipe();
}



function FindEsoCharNextRecipe()
{
	var isFound = false;
	
	$(".ecdRecipeSearchHighlight").removeClass("ecdRecipeSearchHighlight");
		
	$(".ecdRecipeItem").each(function(index) {
		
		if (index <= lastRecipeSearchPos) return true;
		
		var $this = $(this);
		var text = $this.text().toLowerCase();
		
		lastRecipeSearchPos = index;
		
		if (text.indexOf(lastRecipeSearchText) >= 0) 
		{
			if (lastRecipeSearchElement != null && $this.is(lastRecipeSearchElement)) return true;
			
			lastRecipeSearchElement = $this;
			SelectFoundEsoCharRecipe($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastRecipeSearchText = "";
		lastRecipeSearchPos = -1;
		lastRecipeSearchElement = null;
		$("#ecdSkillRecipesSearchBlock button").text("Done!");
	}
	else
	{
		$("#ecdSkillRecipesSearchBlock button").text("Next...");
	}
}


function SelectFoundEsoCharRecipe(element, instant)
{
	element.addClass("ecdRecipeSearchHighlight");
	
	var offsetTop = element.position().top;
	var parent = element.parent("#ecdSkill_Recipes");
	var nextAch = element.next(".ecdRecipeItem ");
	var nextTop = offsetTop + element.height() + 25;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (instant) delay = 0;
	
	if (offsetTop < 0)
	{
		parent.animate({ 
	        scrollTop: offsetTop + parent.scrollTop(),
	    }, delay);
	}
	else if (nextTop > parent.height())
	{
		parent.animate({ 
	        scrollTop: nextTop - parent.height() + parent.scrollTop(),
	    }, delay);
	}
}


function OnEsoRecipeScroll(event)
{
	$("#ecdSkillRecipesSearchBlock").css('top', $("#ecdSkill_Recipes").scrollTop());
}


function UpdateEsoInventoryShownSpace()
{
	$(".ecdInvShowSpaceLabel").text("");
	
	setTimeout(UpdateEsoInventoryShownSpace_Async, 100);
}


function UpdateEsoInventoryShownSpace_Async()
{	
	var shownItems = $(".ecdItemTable tr.eso_item_link:visible");
	var numItems = 0;
	
	numItems = shownItems.length;
	$(".ecdInvShowSpaceLabel").text("" + numItems + " items shown");
	return;
	
	shownItems.each(function() {
		var itemIndex = parseInt($(this).attr("localid"));
		var itemData = ecdAllInventory[itemIndex];
		if (itemData == null) return true;
		
		if (itemData.stacks == null)
			numItems += 1;
		else
			numItems += itemData.stacks;
		
		return true;		
	});
	
	$(".ecdInvShowSpaceLabel").text("" + numItems + " items");
}


function onDocReady() 
{  
	$(".ecdTooltipTrigger").hover(onTooltipHoverShow, onTooltipHoverHide, onTooltipMouseMove);
	$(".ecdTooltip").hover(onTooltipHoverHide, onTooltipHoverHide, onTooltipHoverHide);
	
	$('.ecdSkillTreeName1').click(OnEsoSkillTreeName1Click);
	$('.ecdSkillTreeName2').click(OnEsoSkillTreeName2Click);
	
	EsoSkillTree_LastOpenTreeName = $('.ecdSkillTreeName1:visible').first();
	EsoSkillTree_LastOpenTree = EsoSkillTree_LastOpenTreeName.next(".ecdSkillTreeContent1");
	
	EsoSkillTree_LastSkillContentName = $('.ecdSkillTreeNameHighlight2').first();
	EsoSkillTree_LastSkillContent = $('.ecdSkillData:visible').first();
		
	$('.ecdAchTreeName1').click(OnEsoAchievementTreeName1Click);
	$('.ecdAchTreeName2').click(OnEsoAchievementTreeName2Click);
	
	EsoAchTree_LastOpenTreeName = $('.ecdAchTreeName1:visible').first();
	EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
	EsoAchTree_LastContentName = $('.ecdAchTreeNameHighlight2').first();
	EsoAchTree_LastContent = $('.ecdAchData:visible').first();
	
	var tables = $(".tablesorter");
	
	if (tables.tablesorter)
	{
		$("#ecdRoot .tablesorter").tablesorter({
			sortList: [[2,0]] 
		});
		
		//$("#ecdBuildTable").tablesorter();
	}
	
	$(".ecdItemFilterTextInput").keyup(function() {
			//$(".ecdItemFilterTextInput").val(this.value);
			UpdateItemFilter();
			return true;
		});
	
	$(".ecdItemFilterTextInput").blur(function() {
			$(".ecdItemFilterTextInput").val(this.value);
			return true;
		});
	
	$('.ecdClickToCopy').click(function() {
    		copyToClipboard(this);
		});
	
	$('.ecdClickToCopyTooltip').click(function() {
			var text = $(this).attr('tooltip');
			copyTextToClipboard(text);
		});
	
	
	$("#ecdBuildTable a").click(OnBuildTableAnchorClick);
	$(".ecdBuildRowHover td").not(".ecdBuildTableButtons").click(OnBuildTableRowClick);
	
	$("#ecdWeaponBar1").click(OnBuildWeaponBar1Click);
	$("#ecdWeaponBar2").click(OnBuildWeaponBar2Click);
	
	$(".ecdActionBar1").click(OnBuildActionBar1Click);
	$(".ecdActionBar2").click(OnBuildActionBar2Click);
	$(".ecdActionBar3").click(OnBuildActionBar3Click);
	$(".ecdActionBar4").click(OnBuildActionBar4Click);
	
	$(".ecdScrollContent tr").click(OnItemRowClick);
	
	$(".ecdScrollContent tr").mouseleave(OnItemRowLeave);
	
	$(".ecdAchievement1").click(OnAchievementClick);
	
	$("#ecdFindAchInput").keyup(function(e) {
		if (e.keyCode == 13) 
			OnFindEsoCharAchievement();
		else
			$(".ecdFindAchTextBox button").text("Find...");
	});
	
	$("#ecdSkillRecipesSearchInput").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchRecipe();
		else
			$("#ecdSkillRecipesSearchBlock button").text("Find...");
	});
	
	$("#ecdSkill_Recipes").on("scroll", OnEsoRecipeScroll);
	
	if (!DoesEsoItemLinkHaveEvent()) $('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
	
	UpdateEsoInventoryShownSpace();
}


$(document).ready(onDocReady);


