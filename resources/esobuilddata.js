var ecdLastTooltip = null;


function EsoBuildLog()
{
	if (console == null) return;
	if (console.log == null) return;
	
	console.log.apply(console, arguments);
}


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
	
	var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    var toolTipWidth = tooltip.width();
    var toolTipHeight = tooltip.height();
    var elementHeight = parent.height();
    var elementWidth = parent.width();
    var NARROW_WINDOW_WIDTH = 800;
     
    var top = parent.offset().top - 50;
    var left = parent.offset().left + parent.outerWidth() + 3;
        
    if (windowWidth < NARROW_WINDOW_WIDTH)
    {
    	top = parent.offset().top - 25 - toolTipHeight;
    	left = parent.offset().left - toolTipWidth/2 + elementWidth/2;
    }
    
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
    	
    	if (windowWidth < NARROW_WINDOW_WIDTH) deltaHeight = -toolTipHeight - elementHeight - 30;
    	
        top = top - deltaHeight
    }
         
    if (viewportTooltip.right > windowWidth) 
    {
    	if (windowWidth < NARROW_WINDOW_WIDTH)
    		left = left + windowWidth - viewportTooltip.right - 10;
    	else
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
	$('.ecdAchTreeNameHighlight2').removeClass("ecdAchTreeNameHighlight2");
	//EsoAchTree_LastContentName.removeClass('ecdAchTreeNameHighlight2');
	
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
	
	//EsoAchTree_LastContentName.removeClass('ecdAchTreeNameHighlight2');
	$('.ecdAchTreeNameHighlight2').removeClass("ecdAchTreeNameHighlight2");
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


function OnEsoRightTitleClick(name, self)
{
	$('.ecdRightTitleButtonEnabled').addClass("ecdRightTitleButtonDisabled").removeClass("ecdRightTitleButtonEnabled");
	$('.ecdTopLevelIcon').removeClass('selected');
	
	$(self).children(".ecdTopLevelIcon").addClass('selected');
	
	var idName = "#ecd" + name;
	var idButtonName = "#ecd" + name + "Button";
	$(idButtonName).removeClass("ecdRightTitleButtonDisabled").addClass("ecdRightTitleButtonEnabled");
	
	$(".ecdRightDataArea").hide();
	
	var newContent = $(idName);
	
	CheckEsoContentForAsyncLoad(newContent, name);
	newContent.show();
	
	UpdateEsoInventoryShownSpace();
}


function CheckEsoContentForAsyncLoad(element, contentId)
{
	var asyncLoadElement = $(element).children(".ecdAsyncLoad");
	
	if (asyncLoadElement.length < 1) return false;
	
		/* Load inventory JSON data if required */
	if ($.isEmptyObject(ecdAllInventory) && (contentId == "Inventory" || contentId == "Bank" || contentId == "Craft" || contentId == "AccountInv"))
	{
		var queryParams = {}
		
		queryParams['content'] = "AllInventoryJS";
		queryParams['id'] = ecdCharacterId;
		
		$.ajax("//esochars.uesp.net/loadCharDataContents.php", {
				data: queryParams,
			}).
			done(function(data, status, xhr) { OnEsoCharDataJsonRequest(data, "AllInventoryJS", status, xhr); }).
			fail(function(xhr, status, errorMsg) { OnEsoCharDataJsonError(xhr, "AllInventoryJS", status, errorMsg); });
	}
	
	var queryParams = {}
	
	queryParams['content'] = contentId;
	queryParams['id'] = ecdCharacterId;
	
	
	
	$.ajax("//esochars.uesp.net/loadCharDataContents.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoCharDataContentRequest(data, contentId, asyncLoadElement, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoCharDataContentError(xhr, contentId, asyncLoadElement, status, errorMsg); });
	
	return true;
}


function OnEsoCharDataContentRequest(data, contentId, element, status, xhr)
{
	var parent = $(element).parent();
	
	$(element).replaceWith(data);
	AddEsoCharDataAsyncHandlers(parent);
}


function OnEsoCharDataContentError(xhr, contentId, element, status, errorMsg)
{
	EsoBuildLog("Error requesting char data content '" + contentId + "'!", errorMsg);
}


function OnEsoCharDataJsonRequest(data, contentId, status, xhr)
{
	if (contentId == "AllInventoryJS") ecdAllInventory = data;	
}


function OnEsoCharDataJsonError(xhr, contentId, status, errorMsg)
{
	EsoBuildLog("Error requesting char data JSON '" + contentId + "'!", errorMsg);
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
	
	g_EsoCharLastItemFilter = null;
	
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


var g_EsoCharLastItemFilter = null;
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
    var left = element.offset().left + 350;
    
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
		
	$(".ecdAchName, .ecdAchDesc, .ecdAchReward, .ecdAchCriteria, .ecdAchListItem img").each(function(index) {
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
	var parentList = element.parent(".ecdRecipeList");
	var parent = parentList.parent("#ecdSkill_Recipes");
	var nextTop = offsetTop + element.height() + 25;
	var bottomScroll = parent.scrollTop() + parent.height();
	var delay = 400;
	
	if (!parentList.is(":visible"))
	{
		SetRecipeTitleArrow(parentList.prev(".ecdRecipeTitle"), true);
		parentList.show(0, function() { SelectFoundEsoCharRecipe(element, instant); });
		return;
	}
	
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
	var totalItems = 0;
	
	numItems = shownItems.length;
	//$(".ecdInvShowSpaceLabel").text("" + numItems + " shown");
	//return;
	
	shownItems.each(function() {
		var itemIndex = parseInt($(this).attr("localid"));
		var itemData = ecdAllInventory[itemIndex];
		if (itemData == null) return true;
		
		if (itemData.qnt == null)
			totalItems += 1;
		else
			totalItems += parseInt(itemData.qnt);
		
		return true;		
	});
	
	if (numItems == totalItems)
		$(".ecdInvShowSpaceLabel").text("" + numItems + " shown");
	else
		$(".ecdInvShowSpaceLabel").text("" + numItems + " shown (" + totalItems + " total)");
}


function OnRecipeTitleClick(e)
{
	var recipeList = $(this).next(".ecdRecipeList");

	SetRecipeTitleArrow(this, !recipeList.is(":visible"));
	
	recipeList.slideToggle();
}


function SetRecipeTitleArrow(element, visible)
{
	var recipeArrow = $(element).children(".ecdRecipeTitleArrow");
	
	if (visible)
		recipeArrow.html("&#9650");
	else
		recipeArrow.html("&#9660");
	
}


function OnQuestZoneTitleClick(e)
{
	var lastOpenQuestZone = $(".ecdQuestZoneTitle.ecdQuestSelected").first();
	if (lastOpenQuestZone.is($(this))) return;
	
	lastOpenQuestZone.removeClass("ecdQuestSelected");
	lastOpenQuestZone.next(".ecdQuestZoneList").slideUp();
	
	$(this).addClass("ecdQuestSelected");
	var questList = $(this).next(".ecdQuestZoneList");
	
	questList.slideDown();
	
	$(".ecdQuestName.ecdQuestSelected").removeClass("ecdQuestSelected");
	
	var firstQuest = questList.children(".ecdQuestName").first();
	firstQuest.addClass('ecdQuestSelected');
	
	var journalIndex = firstQuest.attr("journalindex");
	
	if (journalIndex != null )
	{
		$(".ecdQuestDetail:visible").hide(0);
		$("#ecdQuestJournal" + journalIndex).show(0);
	}
}


function OnQuestZoneTitle1Click(e)
{
	var questList = $(this).next(".ecdQuestZoneList1");
	questList.slideToggle();
}


function OnQuestNameClick(e)
{
	var lastOpenQuest = $(".ecdQuestName.ecdQuestSelected").first();
	if (lastOpenQuest.is($(this))) return;
	
	lastOpenQuest.removeClass("ecdQuestSelected");
	
	$(this).addClass("ecdQuestSelected");
	
	var journalIndex = $(this).attr("journalindex");
	
	if (journalIndex != null)
	{
		$(".ecdQuestDetail:visible").hide(0);
		$("#ecdQuestJournal" + journalIndex).show(0);
	}
}


function UpdateFirstQuestDetails()
{
	var firstQuest = $(".ecdQuestZoneTitle.ecdQuestSelected").next(".ecdQuestZoneList").children(".ecdQuestName").first()[0];
	
	if (firstQuest) OnQuestNameClick.call(firstQuest, null);
}


var lastEsoAllQuestSearchText = "";
var lastEsoAllQuestSearchPos = -1;
var lastEsoAllQuestSearchElement = null;


function OnEsoCharDataSearchAllQuests()
{
	var text = $("#ecdQuestAllSearchText").val().trim().toLowerCase();
	if (text == "") return;
	
	if (text != lastEsoAllQuestSearchText)
	{
		lastEsoAllQuestSearchText = text;
		lastEsoAllQuestSearchPos = -1;
		lastEsoAllQuestSearchElement = null;
	}
	
	FindEsoCharNextAllQuest();
}


function FindEsoCharNextAllQuest()
{
	var isFound = false;
	
	$(".ecdQuestSearchHighlight").removeClass("ecdQuestSearchHighlight");
		
	$("#ecdQuestJournalAll .ecdQuestName1").each(function(index) {
		if (index <= lastEsoAllQuestSearchPos) return true;
		var $this = $(this);
		var text = $this.text().toLowerCase();
				
		lastEsoAllQuestSearchPos = index;
		
		if (text.indexOf(lastEsoAllQuestSearchText) >= 0) 
		{
			if (lastEsoAllQuestSearchElement != null && $this.is(lastEsoAllQuestSearchElement)) return true;
			
			lastEsoAllQuestSearchElement = $this;
			SelectFoundEsoAllQuest($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastEsoAllQuestSearchText = "";
		lastEsoAllQuestSearchPos = -1;
		lastEsoAllQuestSearchElement = null;
		$("#ecdQuestAllSearchForm button").text("Done!");
	}
	else
	{
		$("#ecdQuestAllSearchForm button").text("Find Next");
	}
}


function SelectFoundEsoAllQuest(quest)
{
	var questList = $(quest).parent(".ecdQuestZoneList1");
	
	if (!questList.is(":visible")) questList.show(0);
	
	quest.addClass("ecdQuestSearchHighlight");
	
	SlideEsoQuestIntoView(quest, true);
}


function SlideEsoQuestIntoView(element, instant)
{
	var offsetTop = element.position().top - 200;
	var parent = element.parents(".ecdQuestDetail");
	var nextTop = offsetTop + element.height() + 225;
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


function OnEsoBookCollectionClick(e)
{
	var categoryIndex = $(this).attr("categoryindex");
	var collectionIndex = $(this).attr("collectionindex");
	
	$(".ecdBookList:visible").hide(0);
	$("#ecdBookList_"+categoryIndex+"_"+collectionIndex).show(0);
	
	$(".ecdBookCollectionSelected").removeClass("ecdBookCollectionSelected");
	$(this).addClass("ecdBookCollectionSelected");
}


function OnEsoBookCategoryClick(e)
{
	var currentCategory = $(".ecdBookCategorySelected").first();
	if ($(this).is(currentCategory)) return;
	
	currentCategory.removeClass("ecdBookCategorySelected");
	$(".ecdBookCollectionList:visible").slideUp();
	
	$(this).addClass('ecdBookCategorySelected');
	
	var nextList = $(this).next(".ecdBookCollectionList");
	var firstBook = nextList.children(".ecdBookCollection").first();
	
	nextList.slideDown();
	
	var categoryIndex = firstBook.attr("categoryindex");
	var collectionIndex = firstBook.attr("collectionindex");
	
	$(".ecdBookList:visible").hide(0);
	$("#ecdBookList_"+categoryIndex+"_"+collectionIndex).show(0);
	
	$(".ecdBookCollectionSelected").removeClass("ecdBookCollectionSelected");
	firstBook.addClass("ecdBookCollectionSelected");	
}



var lastEsoBookSearchText = "";
var lastEsoBookSearchPos = -1;
var lastEsoBookSearchElement = null;


function OnEsoCharDataSearchBooks()
{
	var text = $("#ecdBookSearchText").val().trim().toLowerCase();
	if (text == "") return;
	
	if (text != lastEsoBookSearchText)
	{
		lastEsoBookSearchText = text;
		lastEsoBookSearchPos = -1;
		lastEsoBookSearchElement = null;
	}
	
	FindEsoCharNextBook();
}


function FindEsoCharNextBook()
{
	var isFound = false;
	
	$(".ecdBookSearchHighlight").removeClass("ecdBookSearchHighlight");
		
	$(".ecdBookLine").each(function(index) {
		if (index <= lastEsoBookSearchPos) return true;
		var $this = $(this);
		var text = $this.text().toLowerCase();
				
		lastEsoBookSearchPos = index;
		
		if (text.indexOf(lastEsoBookSearchText) >= 0) 
		{
			if (lastEsoBookSearchElement != null && $this.is(lastEsoBookSearchElement)) return true;
			
			lastEsoBookSearchElement = $this;
			SelectFoundEsoBook($this);
			isFound = true;
			return false
		}
	});
	
	if (!isFound)
	{
		lastEsoBookSearchText = "";
		lastEsoBookSearchPos = -1;
		lastEsoBookSearchElement = null;
		$("#ecdBookSearchForm button").text("Done!");
	}
	else
	{
		$("#ecdBookSearchForm button").text("Find Next");
	}
}


function SelectFoundEsoBook(book)
{
	var bookList = $(book).parent(".ecdBookList");
	
	if (!bookList.is(":visible")) 
	{
		$(".ecdBookList:visible").hide(0);
		bookList.show(0);
		
		var categoryIndex = bookList.attr("categoryindex");
		var collectionIndex = bookList.attr("collectionindex");
		
		$(".ecdBookCollectionSelected").removeClass("ecdBookCollectionSelected");
		
		var collection = $(".ecdBookCollection[categoryindex='" + categoryIndex + "'][collectionindex='" + collectionIndex + "']");
		var collectionList = collection.parent(".ecdBookCollectionList");
		collection.addClass("ecdBookCollectionSelected");
		
		if (!collectionList.is(":visible"))
		{
			var currentCategory = $(".ecdBookCategorySelected").first();
			var newCategory = collectionList.prev(".ecdBookCategory");
			
			currentCategory.removeClass("ecdBookCategorySelected");
			newCategory.addClass("ecdBookCategorySelected");
			
			$(".ecdBookCollectionList:visible").hide(0);
			collectionList.show(0);
		}
		
		SlideEsoBookCollectionIntoView(collection, true);
	}
	
	book.addClass("ecdBookSearchHighlight");
	
	SlideEsoBookIntoView(book, true);
}


function SlideEsoBookIntoView(element, instant)
{
	var offsetTop = element.position().top - 200;
	var parent = element.parent(".ecdBookList");
	var nextTop = offsetTop + element.height() + 225;
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


function SlideEsoBookCollectionIntoView(element, instant)
{
	var offsetTop = element.position().top - 200;
	var parent = element.parents(".ecdBookTree");
	var nextTop = offsetTop + element.height() + 225;
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


function OnEsoBookClick(e)
{
	var queryParams = {}
	var bookId = $(this).attr("bookid");
	
	queryParams['table'] = 'book';
	queryParams['id'] = bookId;
	
	$.ajax("//esolog.uesp.net/exportJson.php", {
			data: queryParams,
		}).
		done(function(data, status, xhr) { OnEsoBookDataRequest(data, status, xhr); }).
		fail(function(xhr, status, errorMsg) { OnEsoBookDataError(xhr, status, errorMsg); });
	
	return true;
}


function OnEsoBookDataRequest(data, status, xhr)
{
	ShowEsoBook(data.book[0]);
}


function OnEsoBookDataError(xhr, status, errorMsg)
{
	EsoBuildLog("Error requesting book data!", errorMsg);
}


function ShowEsoBook(book)
{
	var bookRoot = $("#ecdBookRoot");
	var bookContents = $("#ecdBookContents");
	var output = "";
	
	bookRoot.show(0);
	
	$(document).on("click.OnEsoBookClickDocument", OnEsoBookClickDocument);
	
	output += "<div class='ecdBookTitle'>" + book.title + "</div>";
	output += "<div class='ecdBookBody'>" + book.body + "</div>";
	
	bookContents.html(output);
}


function OnEsoBookCloseClick()
{
	var bookRoot = $("#ecdBookRoot");
	bookRoot.hide(0);
}


function OnEsoBookClickDocument()
{
	var bookRoot = $("#ecdBookRoot");
	bookRoot.hide(0);
	$(document).off("click.OnEsoBookClickDocument");
}


function OnEsoCategoryCollectibleClick()
{
	var lastCategory = $(".ecdCollectibleCategorySelected").first();
	if ($(this).is(lastCategory)) return;
	
	lastCategory.removeClass('ecdCollectibleCategorySelected');
	$(this).addClass('ecdCollectibleCategorySelected');
	
	$(".ecdCollectibleSubcategories:visible").slideUp();
	
	var subCategoryList = $(this).next(".ecdCollectibleSubcategories");
	if (subCategoryList.text() != "") subCategoryList.slideDown();
	
	$(".ecdCollectibleBlock:visible").hide(0);
	
	var categoryIndex = $(this).attr('categoryindex');
	var subCategoryIndex = 0;
	var collectibleBlock = 	$("#ecdCollectible_" + categoryIndex + "_" + subCategoryIndex);
	
	if (collectibleBlock.length > 0)
	{
		collectibleBlock.show(0);
		return;
	}
	
	var firstSubcategory = $(this).next(".ecdCollectibleSubcategories").children(".ecdCollectibleSubcategory").first();
	
	$(".ecdCollectibleSubcategorySelected").removeClass('ecdCollectibleSubcategorySelected');
	firstSubcategory.addClass('ecdCollectibleSubcategorySelected');
	
	categoryIndex = firstSubcategory.attr('categoryindex');
	subCategoryIndex = firstSubcategory.attr('subcategoryindex');
	
	$("#ecdCollectible_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


function OnEsoSubcategoryCollectibleClick()
{
	var lastSubcategory = $(".ecdCollectibleSubcategorySelected").first();
	if ($(this).is(lastSubcategory)) return;
	
	lastSubcategory.removeClass('ecdCollectibleSubcategorySelected');
	
	$(this).addClass('ecdCollectibleSubcategorySelected');
	
	$(".ecdCollectibleBlock:visible").hide(0);
	
	var categoryIndex = $(this).attr('categoryindex');
	var subCategoryIndex = $(this).attr('subcategoryindex');
	
	$("#ecdCollectible_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


function OnEsoCollectionsMenuItemClick()
{
	var collectible = $(this).attr("collectid");
	var title = $(this).attr("title");
	
	$(".ecdCollectMenuItemSelected").removeClass("ecdCollectMenuItemSelected");
	$(this).addClass("ecdCollectMenuItemSelected");
	
	$("#ecdCollectMenuTitle").text(title.toUpperCase());
	
	$(".ecdCollectContents:visible").hide(0);
	$("#ecdCollectContents_"+collectible).show(0);
}


function OnEsoCategoryOutfitClick()
{
	var lastCategory = $(".ecdOutfitCategorySelected").first();
	if ($(this).is(lastCategory)) return;
	
	lastCategory.removeClass('ecdOutfitCategorySelected');
	$(this).addClass('ecdOutfitCategorySelected');
	
	$(".ecdOutfitSubcategories:visible").slideUp();
	
	var subCategoryList = $(this).next(".ecdOutfitSubcategories");
	if (subCategoryList.text() != "") subCategoryList.slideDown();
	
	$(".ecdOutfitBlock:visible").hide(0);
		
	var firstSubcategory = $(this).next(".ecdOutfitSubcategories").children(".ecdOutfitSubcategory").first();
	
	$(".ecdOutfitSubcategorySelected").removeClass('ecdOutfitSubcategorySelected');
	firstSubcategory.addClass('ecdOutfitSubcategorySelected');
	
	var categoryIndex = firstSubcategory.attr('categoryindex');
	var subCategoryIndex = firstSubcategory.attr('subcategoryindex');
	
	$("#ecdOutfit_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


function OnEsoSubcategoryOutfitClick()
{
	var lastSubcategory = $(".ecdOutfitSubcategorySelected").first();
	if ($(this).is(lastSubcategory)) return;
	
	lastSubcategory.removeClass('ecdOutfitSubcategorySelected');
	
	$(this).addClass('ecdOutfitSubcategorySelected');
	
	$(".ecdOutfitBlock:visible").hide(0);
	
	var categoryIndex = $(this).attr('categoryindex');
	var subCategoryIndex = $(this).attr('subcategoryindex');
	
	$("#ecdOutfit_" + categoryIndex + "_" + subCategoryIndex).show(0);
}


function AddEsoCharDataAsyncHandlers(parent)
{
	var $parent = $(parent);
	
	if ($parent.find('.ecdAchTreeName1').length > 0)
	{
		$parent.find('.ecdAchTreeName1').click(OnEsoAchievementTreeName1Click);
		$parent.find('.ecdAchTreeName2').click(OnEsoAchievementTreeName2Click);
	
		EsoAchTree_LastOpenTreeName = $parent.find('.ecdAchTreeName1:visible').first();
		EsoAchTree_LastOpenTree = EsoAchTree_LastOpenTreeName.next(".ecdAchTreeContent1");
	
		EsoAchTree_LastContentName = $parent.find('.ecdAchTreeNameHighlight2').first();
		EsoAchTree_LastContent = $parent.find('.ecdAchData:visible').first();
	}
	
	$parent.find(".ecdSelectAchievement1").click(OnAchievementClick);
	
	var tables = $parent.find(".tablesorter");
	
	if (tables.tablesorter)
	{
		$parent.find(".tablesorter").tablesorter({
			sortList: [[2,0]] 
		});
	}
	
	$parent.find(".ecdItemFilterTextInput").keyup(function() {
		UpdateItemFilter();
		return true;
	});

	$parent.find(".ecdItemFilterTextInput").blur(function() {
			$(".ecdItemFilterTextInput").val(this.value);
			return true;
		});
	
	$parent.find('.ecdClickToCopy').click(function() {
			copyToClipboard(this);
		});
	
	$parent.find('.ecdClickToCopyTooltip').click(function() {
			var text = $(this).attr('tooltip');
			copyTextToClipboard(text);
		});
	
	$parent.find(".ecdScrollContent tr").click(OnItemRowClick);
	$parent.find(".ecdScrollContent tr").mouseleave(OnItemRowLeave);
		
	$parent.find(".ecdQuestZoneTitle").click(OnQuestZoneTitleClick);
	$parent.find(".ecdQuestZoneTitle1").click(OnQuestZoneTitle1Click);
	$parent.find(".ecdQuestName ").click(OnQuestNameClick);
	
	$parent.find("#ecdFindAchInput").keyup(function(e) {
		if (e.keyCode == 13) 
			OnFindEsoCharAchievement();
		else
			$(".ecdFindAchTextBox button").text("Find...");
	});
	
	$parent.find("#ecdSkillRecipesSearchInput").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchRecipe();
		else
			$("#ecdSkillRecipesSearchBlock button").text("Find...");
	});
	
	$parent.find("#ecdQuestAllSearchText").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchAllQuests();
		else
			$("#ecdQuestAllSearchForm button").text("Find...");
	});
	
	$parent.find("#ecdBookSearchText").keyup(function(e) {
		if (e.keyCode == 13) 
			OnEsoCharDataSearchBooks();
		else
			$("#ecdBookSearchForm button").text("Find...");
	});	
	
	$parent.find("#ecdSkill_Recipes").on("scroll", OnEsoRecipeScroll);
	
	$parent.find(".ecdRecipeTitle").click(OnRecipeTitleClick);
	
	$parent.find(".ecdBookCollection").click(OnEsoBookCollectionClick);
	$parent.find(".ecdBookCategory").click(OnEsoBookCategoryClick);
	$parent.find(".ecdBookLine").click(OnEsoBookClick);
	$parent.find(".ecdBookClose").click(OnEsoBookCloseClick);
	
	$parent.find(".ecdCollectibleCategory").click(OnEsoCategoryCollectibleClick);
	$parent.find(".ecdCollectibleSubcategory").click(OnEsoSubcategoryCollectibleClick);
	$parent.find(".ecdCollectMenuItem").click(OnEsoCollectionsMenuItemClick);
	
	$parent.find(".ecdOutfitCategory").click(OnEsoCategoryOutfitClick);
	$parent.find(".ecdOutfitSubcategory").click(OnEsoSubcategoryOutfitClick);
	
	$parent.find(".ecdBookCategory").first().trigger("click");
	$parent.find(".ecdCollectibleCategory").first().trigger("click");
	$parent.find(".ecdQuestZoneTitle").first().trigger("click");
		 	
	if (!DoesEsoItemLinkHaveEvent() || !$parent.is($(document))) $parent.find('.eso_item_link').hover(OnEsoItemLinkEnter, OnEsoItemLinkLeave);
}


function FormatEsoTimeLeft(timeLeft)
{
	var days = Math.floor(timeLeft / 3600 / 24);
	var hours = Math.floor(timeLeft / 3600) % 24;
	var minutes = Math.floor(timeLeft / 60) % 60;
	var seconds = timeLeft % 60;
	var timeFmt = "";
	
	if (days > 1)
		timeFmt = '' + days.toString() + ' days '+ hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
	else if (days > 0)
		timeFmt = '' + days.toString() + ' day '+ hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
	else
		timeFmt = '' + hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0') + ':' + seconds.toString().padStart(2, '0')
	
	return timeFmt;
}


function UpdateEsoCharDataHirelingTime(index, element)
{
	var nowTime = Math.floor(Date.now() / 1000);
	var baseTime = $(this).attr("timestamp");
	var skillLevel = $(this).attr("skill");
	
	if (baseTime == null || skillLevel == null || baseTime <= 0 || skillLevel <= 0) return;
	
	baseTime = +baseTime;
	skillLevel = +skillLevel;
		
	var newTime = ((skillLevel >= 3) ? 12 : 24) * 3600 + baseTime;
		
	if (newTime > nowTime)
		$(this).text(FormatEsoTimeLeft(newTime - nowTime));
	else
		$(this).text("Ready!");
}


function UpdateEsoCharDataRidingTime(index, element)
{
	var nowTime = Math.floor(Date.now() / 1000);
	var baseTime = $(this).attr("timestamp");
	
	if (baseTime == null || baseTime <= 0) return;
	
	baseTime = +baseTime;
	
	if (baseTime > nowTime)
		$(this).text(FormatEsoTimeLeft(baseTime - nowTime));
	else
		$(this).text("Ready!");
}


function OnEsoCharDataTimeUpdate()
{
	$(".ecdHirelingTime").each(UpdateEsoCharDataHirelingTime);
	$(".ecdRidingTime").each(UpdateEsoCharDataRidingTime);	
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
		
	$("#ecdBuildTable a").click(OnBuildTableAnchorClick);
	$(".ecdBuildRowHover td").not(".ecdBuildTableButtons").click(OnBuildTableRowClick);
	
	$("#ecdWeaponBar1").click(OnBuildWeaponBar1Click);
	$("#ecdWeaponBar2").click(OnBuildWeaponBar2Click);
	
	$(".ecdActionBar1").click(OnBuildActionBar1Click);
	$(".ecdActionBar2").click(OnBuildActionBar2Click);
	$(".ecdActionBar3").click(OnBuildActionBar3Click);
	$(".ecdActionBar4").click(OnBuildActionBar4Click);
	
	setInterval(OnEsoCharDataTimeUpdate, 1000);
	
	AddEsoCharDataAsyncHandlers(document);
	
	UpdateEsoInventoryShownSpace();
	UpdateFirstQuestDetails();
}


$(document).ready(onDocReady);


