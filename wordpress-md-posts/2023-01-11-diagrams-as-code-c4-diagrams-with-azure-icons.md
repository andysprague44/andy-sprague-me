# Diagrams as Code - C4 diagrams with Azure icons
_Date: 2023-01-11 20:46:51_

This article is very persuasive. By the end you will wonder why you ever used Visio. It gets more technical as you progress, so stop reading whenever you want (I suppose this is true whether I wrote this sentence or not).

I discuss:

* *C4 diagrams* (and why)
* how to use *code* to generate them (and why)
* how I have gone about doing it (plantuml, Azure icons, font-awesome-5 icons).

Just want the code? <https://github.com/andysprague44/sprague.andy.plantuml.c4>

## C4

C4 diagrams are a great way to visualize a system design from different levels of detail. You share C1 with the CEO, C2 with the CTO and stakeholders .. and then you never need to create C3 and C4 diagrams for lower level detail as this emerges from a good code base and face-to-face discussions within the team (or, at a push, it's a photo of a whiteboard sketch).

For more on what C4 is, see <https://www.infoq.com/articles/C4-architecture-model>.

## Diagrams as Code

Diagrams as code (DaC)...

* How many times have you seen a Visio diagram in a power point presentation shared with you, that you want to correct / update / use as a template?

* Did the original visio file come with that? [If it did, go and congratulate the author right now!]
* Or, worse, the diagram was created *in* powerpoint [dragging rectangles for a few hours anyone?]

In addition, systems change and evolve, and it's not often that the diagrams evolve with it.

Solution? *Put the diagrams with the code, in the same repo*. Ergo, **Diagrams as Code**.

Now, you could just save the visio / powerpoint / png to the repo, but here comes the second advantage of diagrams as code - the "code" is essentially a text file that describes a diagram, and then that diagram is *generated for you*. You may have to do some massaging to get it to display exactly as you want, but it's much better and time efficient to add/delete 1 line of a text file, than dragging rectangles around on a WYSYWIG editor for a few hours, in my humble opinion.

*If you disagree*, the rest of this article is not for you (spend the time you save by not reading on to have a strong word with yourself and question your life priorities).

---

## plantuml

There are a plethora of Diagram as Code solutions out there. I choose plantuml for it's simplicity, because it's not tied to a particular programming language, and because it has a vs code plugin.

The example diagrams on the plantuml site are not pretty, so I suggest you start with C4 support in the standard library: <https://github.com/plantuml-stdlib/C4-PlantUML>. For implementation agnostic C4 diagramming with plantuml start here, and do not read further.

---

### plantuml in vs code

plantuml has plugins for many IDEs and text editors, see if yours is supported here: <https://plantuml.com/running> *-> Text editors and IDE*.

For VS Code ... install extension "PlantUML"

![](https://andysprague.com/wp-content/uploads/2023/01/image.png?w=1024)

Add a file *testdot.wsd* with these contents:

```
@startuml test
testdot
@enduml
```

Right click and selection "Preview Current Diagram" (shortcut Alt + D), you should see something like:

![](https://andysprague.com/wp-content/uploads/2023/01/image-1.png?w=367)


---

## We got here... creating diagrams!

The easiest thing to do here is to give you my template, that supports C4, Azure and font-awesome icons (e.g. a component to represent an excel file). Copy to your project, and get diagramming!

```
@startuml C1_MyApp_SystemContext
'Alt + D to preview
!pragma revision 1

'C4
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Context.puml
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Container.puml
!includeurl https://raw.githubusercontent.com/RicardoNiepel/C4-PlantUML/master/C4_Component.puml

'Azure
'Search the full list here: 
!define Azure https://raw.githubusercontent.com/RicardoNiepel/Azure-PlantUML/master/dist
!includeurl Azure/AzureCommon.puml
!includeurl Azure/AzureC4Integration.puml
!includeurl Azure/Web/AzureWebApp.puml

'Comment/uncomment the next line for simplified view of Azure sprites
'!includeurl Azure/AzureSimplified.puml

'FontAwesome and other icon sets
' Search the full list here: 
!define ICONURL https://raw.githubusercontent.com/tupadr3/plantuml-icon-font-sprites/v2.4.0
!includeurl ICONURL/font-awesome-5/file_excel.puml

title [System Context] My Application

'left to right direction

Person(personAlias, "Label", "Optional Description")
AzureWebApp(containerAlias, "Label", "Technology", "Optional Description")
Component(systemAlias, "Label", "Technology", "Optional Description", $sprite=file_excel)

personAlias --> containerAlias : Uses\n[Optional Technology]
containerAlias -right-> systemAlias #Purple : Generates

@enduml
```

![](https://andysprague.com/wp-content/uploads/2023/01/c1_myapp_systemcontext.png?w=407)


---

## Layout Tweaking

I prefer to use the --> syntax for defining arrows over the "Rel" component of C4 library as it seems to give more control over how the diagram gets rendered.

For some ways to play around with the formatting start here: <https://crashedmind.github.io/PlantUMLHitchhikersGuide/layout/layout.html>.

**Use sparingly!** If you customize the format too much, it makes changes in the future harder as you'll need to play around with getting it "just right" all over again.

---

**That's all folks!**